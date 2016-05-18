var path = require('path');
var config = require('config');
var Knex = require('knex');

var conf;

function connectionString (dbname) {
  const user = conf.postgres.user;
  const password = conf.postgres.password;
  const host = conf.postgres.host;
  const port = conf.postgres.port;
  const ssl = conf.postgres.ssl;
  return `postgres://${user}:${password}@${host}:${port}/${dbname}?ssl=${ssl}`;
}

function configuring () {
  return config.load().then(function (configObject) {
    conf = configObject;
  });
}

var knex = (function () {
  var instance;
  return function () {
    if (!instance) {
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
      instance = Knex({
        client: 'pg',
        connection: connectionString('postgres'),
        // debug: true
      });
    }
    return instance;
  }
})();

function drop () {
  return knexAdmin().raw(`drop database ${conf.postgres.dbname};`).then(function () {
    console.log(`Database ${conf.postgres.dbname} dropped`);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function create () {
  return knexAdmin().raw(`create database ${conf.postgres.dbname};`).then(function () {
    console.log(`Database ${conf.postgres.dbname} created`);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function status () {
  return knexAdmin()('pg_database').where({datname: conf.postgres.dbname}).select(knexAdmin().raw('count(*) = 1 as exists')).then(function (rows) {
    var exists = rows[0].exists;
    if (exists) {
      return knex().migrate.currentVersion();
    } else {
      return 'non-existing';
    }
  }).then(function (result) {
    console.log('Current version of database is', result);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function latest () {
  return knex().migrate.latest().then(function (result) {
    console.log('Database migrated to latest version');
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function running (command) {
  console.log(command);
  switch (command) {
    case 'drop':
      return drop();
    case 'create':
      return create();
    case 'status':
      return status();
    case 'latest':
      return latest();
  }
}

configuring().then(function () {
  return running(process.argv[2]);
}).then(function () {
  process.exit(0);
}).catch (function (err) {
  console.log('Error', err);
  process.exit(1);
});
