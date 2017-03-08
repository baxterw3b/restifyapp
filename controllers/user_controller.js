var helpers = require('../config/helper_functions');
var UserModel = require('../models/user_model');

module.exports = function(server){

  //GET ALL USERS
  server.get('/', function(req,res,next){
    UserModel.find({}, function(err,users){
      if(err){
        helpers.failure(res, next, 'Something went wrong', 500);
      }else{
        if(users === null){
          helpers.failure(res, next, 'No users found in the database.', 404);
        }else{
          helpers.success(res, next, users);
        }
      }
    });
  });

  //GET A SINGLE USER
  server.get('/user/:id', function(req,res,next){
    req.assert('id', 'Id is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
      helpers.failure(res, next, errors[0], 400);
    }else{
      UserModel.findOne({ _id:req.params.id }, function(err,user){
        if(err){
          helpers.failure(res, next, 'Something went wrong.',500);
        }
        if(user === null){
          helpers.failure(res, next, 'No user found in the database.', 404);
        }else{
          helpers.success(res, next, user);
        }
      });
    }

  });

  //DELETE A USER
  server.del('/user/:id', function(req,res,next){
    req.assert('id', 'Id is required and must be numeric').notEmpty();
    var errors = req.validationErrors();
    if(errors){
      helpers.failure(res, next, errors[0], 400);
    }else{
      UserModel.findOne({ _id:req.params.id }, function(err,user){
        if(err){
          helpers.failure(res, next, 'Something went wrong.',500);
        }
        if(user === null){
          helpers.failure(res, next, 'No user found in the database.', 404);
        }else{
          user.remove(function(err, user){
            if(err){
              helpers.failure(res, next, 'Error removing the user from the database.', 500);
            }else{
              helpers.success(res, next, 'user deleted succesfully.');
            }

          });
        }
      });
    }

  });

  //CREATE USER
  server.post('/user', function(req,res,next){
    req.assert('first_name', 'first name is required').notEmpty();
    req.assert('last_name', 'last name is required').notEmpty();
    req.assert('email_address', 'email address is required and must be a valid email').notEmpty().isEmail();
    req.assert('career', 'career must be a student, teacher or professor').isIn(['student','teacher','professor']);
    var errors = req.validationErrors();
    if(errors){
      helpers.failure(res, next, errors, 400);
    }else{
      var user = new UserModel({
        first_name: req.params.first_name,
        last_name: req.params.last_name,
        email_address: req.params.email_address,
        career: req.params.career
      });
      user.save(function(err,user){
        if(err){
          helpers.failure(res, next, errors, 500);
        }else{
          helpers.success(res, next, user);
        }
      });
    }

  });

  //UPDATE USER
  server.put('/user/:id', function(req,res,next){
    req.assert('id', 'Id is required and must be numeric').notEmpty();
    var errors = req.validationErrors();
    if(errors){
      helpers.failure(res, next, errors[0], 400);
    }
    UserModel.findOne({ _id:req.params.id }, function(err,user){
      if(err){
        helpers.failure(res, next, 'Something went wrong.',500);
      }else if(user === null){
        helpers.failure(res, next, 'No user found in the database.', 404);
      }else{
        var updates = req.params;
        delete updates.id;
        for(var field in updates){
          user[field] = updates[field];
        }
        user.save(function(err,user){
          if(err){
            helpers.failure(res, next, errors, 500);
          }
          helpers.success(res, next, user);
        });
      }
    });
  });
}
