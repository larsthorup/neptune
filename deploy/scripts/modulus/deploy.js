var assert = require('assert');
var cryptex = require('cryptex');
var requesting = require('request-promise');
var executing = require('../executing');

var projectName = 'lars1';

function sleep (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

cryptex.getSecret('modulus_token').then(function (token) {
  process.env.MODULUS_TOKEN = token;

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
  var dist = 'node_modules/deploy-sandbox-service';
  var commands = [
    `ncp cryptex.json ${dist}/cryptex.json`,
    `ncp cryptex.key ${dist}/cryptex.key`,
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