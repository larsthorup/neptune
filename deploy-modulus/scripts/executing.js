const exec = require('child_process').exec;

function executing () {
  var args = Array.prototype.concat.apply([], arguments);
  return new Promise(function (resolve, reject) {
    args.push(function (err, stdout, stderr) {
      var data = {stdout: stdout, stderr: stderr};
      if (err) { reject(Object.assign(err, data)); } else { resolve(data); }
    });
    exec.apply(null, args);
  });
}

module.exports = executing;