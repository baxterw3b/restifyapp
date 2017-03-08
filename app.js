var restify = require('restify');
var server = restify.createServer();
var restifyValidator = require('restify-validator');
var setupController = require('./controllers/setup_controller');
var userController = require('./controllers/user_controller');

setupController(server, restify, restifyValidator);
userController(server);

server.listen(8080, function(){
  console.log('%s listening at %s', server.name, server.url);
});
