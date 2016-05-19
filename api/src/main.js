var api = require('./api');
api.serving().then(function (server) {
  console.log(`API is running on ${server.url}`);
}).catch(function (err) {
  console.log('Error', err);
});