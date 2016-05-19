var assert = require('assert');
var requesting = require('request-promise');
var local = require('@larsthorup/local');
var config = local('config');
var executing = require('../executing');

var conf;

function configuring () {
  return config.load().then(function (configObject) {
    conf = configObject;
  });
}

var projectName = 'lars1'; // ToDo: use conf.product.id

function sleep (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

configuring().then(function () {
  process.env.MODULUS_TOKEN = conf.modulus.token;

  return executing(`modulus project list`);
}).then(function (result) {
  console.log(result.stdout);

  if (result.stdout.indexOf(projectName) === -1) {
    return executing(`echo yes | modulus project create ${projectName} --servo-size 512 --runtime Node.js`);
 } else {
    return {stdout: ''};
  }
}).then(function (result) {
  console.log(result.stdout);

  console.log('Deploying...');
  // ToDo: use spawn with stdio: inherit, see https://github.com/kentcdodds/cross-env/blob/master/src/index.js
  // ToDo: script: "echo yes | cryptex-env modulus_token modulus project deploy --project-name lars1"

  // Note: we deploy the entire repo for now
  // ToDo: bundle api (with Rollup?) and deploy only that?
  var dist = '..';

  var commands = [
    // `ncp cryptex.json ${dist}/cryptex.json`,
    // `ncp cryptex.key ${dist}/cryptex.key`,
    `cd ${dist}`,
    `echo yes | modulus project deploy --project-name ${projectName}`
  ].join(' && ');
  return executing(commands);
}).then(function (result) {
  console.log(result.stdout);

  return sleep(15000); // ToDo: check and retry instead to finish faster when possible
}).then(function () {

  return requesting({uri: 'https://lars4711.zealake.dk/users', json: true});
}).then(function (users) {
  assert(users.hasOwnProperty('count'), 'Missing count property in response: ' + JSON.stringify(users));
  console.log('Verified: ', users);

  process.exit(0);
}).catch(function (err) {
  console.log('Error', err);
  process.exit(1);
});