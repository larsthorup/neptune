var path = require('path');
var Knex = require('knex');
var local = require('@larsthorup/local');
var config = local('config');

var conf;

function configuring () {
  return config.load().then(function (configObject) {
    conf = configObject;
  });
}

function connectionString (dbname) {
  const user = conf.postgres.user;
  const password = conf.postgres.password;
  const host = conf.postgres.host;
  const port = conf.postgres.port;
  const ssl = conf.postgres.ssl;
  return `postgres://${user}:${password}@${host}:${port}/${dbname}?ssl=${ssl}`;
}

var knex = (function () {
  var instance;
  return function () {
    if (!instance) {
      if (!conf) throw new Error('schema.configuring() must be called before the database can be used');
      instance = Knex({
        client: 'pg',
        connection: connectionString(conf.postgres.dbname),
        migrations: {
          directory: path.join(__dirname, './migrations')
        }
      });
    }
    return instance;
  }
})();

var knexAdmin = (function () {
  var instance;
  return function () {
    if (!instance) {
      if (!conf) throw new Error('schema.configuring() must be called before the database can be used');
      instance = Knex({
        client: 'pg',
        connection: connectionString('postgres'),
        // debug: true
      });
    }
    return instance;
  }
})();



module.exports = {
  configuring,
  knex,
  knexAdmin
};
