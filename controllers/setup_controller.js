module.exports = function(server, restify, restifyValidator){

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(restifyValidator);
  server.use(restify.authorizationParser());
  server.use(function(req, res, next){
    var apiKeys = {
      'user1': 'nmgfm54mekrskklklkleeroso4'
    };
    if(typeof(req.authorization.basic) === 'undefined' || !apiKeys[req.authorization.basic.username] || req.authorization.basic.password !== apiKeys[req.authorization.basic.username]){
      var response = {
        'status': 'failure',
        'data': 'You must provide a API key'
      };
      res.setHeader('content-type', 'application/json');
      res.writeHead(403);
      res.end(JSON.stringify(response));
    }else{
      next();
    }
  });

}
