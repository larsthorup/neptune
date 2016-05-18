var cryptex = require('cryptex');
var config = require('../config');

function getSecrets (environment) {
  if (environment === 'production') {
    return cryptex.getSecrets(['progressql_password']);
  } else {
    return Promise.resolve({});
  }
}

function load () {
  var environment = process.env.NODE_ENV || 'development';
  return getSecrets(environment).then(function (secrets) {
    return config(environment, secrets);
  });
}

module.exports = {
  load
};
