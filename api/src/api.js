var fs = require('fs');
var path = require('path');
var restify = require('restify');
var local = require('@larsthorup/local');
var schema = local('schema');

function userHandler (req, res, next) {
  schema.knex()('user').count('* as userCount').then(function (result) {
    if(result.length < 1) {
      return 0;
    } else {
      return result[0].userCount;
    }
  }).then(function (count) {
    res.send({count: count});
  }).catch(function (err) {
    res.send(500, err);
  });
}

function listening () {
  return new Promise(function (resolve) {
    // ToDo: verify db schema version
    var server = restify.createServer();
    server.pre(restify.CORS());
    server.get('/users', userHandler);
    server.listen(process.env.PORT || 1719, function () {
      resolve(server);
    });
  });
}

function serving () {
  return schema.configuring().then(function () {
    return listening();
  });
}

module.exports = {
  serving: serving
};