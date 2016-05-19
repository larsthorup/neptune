var path = require('path');
var cryptex = require('cryptex');
var config = require('../config');

function getSecrets (environment) {
  if (environment === 'production') {
    var cryptexConfig = {
      keySource: 'file',
      keySourceEncoding: 'base64',
      keySourceOpts: {
        path: path.join(__dirname, '../cryptex.key')
      },
      secrets: require('../cryptex.json').production.secrets
    };
    cryptex.update({config: cryptexConfig});
    return cryptex.getSecrets(['postgresql_password']);
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
