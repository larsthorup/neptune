const path = require('path');
const co = require('co');
const fs = require('fs-extra-promise');

function excludeNodeModules (name) {
  if (path.basename(name) === 'node_modules') return false;
  return true;
}

co(function * () {
  yield fs.removeAsync('output/build');
  yield fs.mkdirsAsync('output/build');
  const srcPackage = yield fs.readJsonAsync('../package.json');
  let dependencies = srcPackage.dependencies;
  for (const projectName of srcPackage.config.projects) {
    yield fs.copyAsync(`../${projectName}`, `output/build/${projectName}`, {filter: excludeNodeModules});
    const projectPackage = yield fs.readJsonAsync(`../${projectName}/package.json`);
    dependencies = Object.assign(dependencies, projectPackage.dependencies);
  }
  const buildPackage = {
    name: `${srcPackage.name}-image`,
    version: srcPackage.version,
    engines: srcPackage.engines,
    dependencies: dependencies,
    scripts: {
      start: srcPackage.scripts['start:api']
    }
  };
  yield fs.writeJsonAsync('output/build/package.json', buildPackage);
}).then(function () {
  process.exit(0);
}).catch(function (err) {
  console.log('error', err);
  process.exit(1);
});