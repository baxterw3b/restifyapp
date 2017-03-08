var restify = require('restify');
var server = restify.createServer();
var restifyValidator = require('restify-validator');
var setupController = require('./controllers/setup_controller');
var userController = require('./controllers/user_controller');
var dbConn = require('./config/db_connection');
var mongoose = require('mongoose');

//stop mongo mongo admin --eval "db.shutdownServer()"
mongoose.connect(dbConn.getMongoConnection());
setupController(server, restify, restifyValidator);
userController(server);

server.listen(8080, function(){
  console.log('%s listening at %s', server.name, server.url);
});
