const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = path.resolve(__dirname, '..')
const package = require(`${root}/package.json`);

package.config.projects.forEach(function (project) {
  const projectPath = path.join(root, project);
  const npmArgs = [process.argv[2]];
  const spawnOptions = {
    cwd: projectPath,
    env: process.env,
    shell: true, // Note: Since npm is a .cmd file on Windows we must run it through the shell
    stdio: 'inherit'
  };
  // console.log(npmArgs, spawnOptions);
  const npmProcess = childProcess.spawnSync('npm', npmArgs, spawnOptions);
  if (npmProcess.status != 0) {
    process.exit(npmProcess.status);
  }
});