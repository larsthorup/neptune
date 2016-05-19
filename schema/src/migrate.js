var path = require('path');
var local = require('@larsthorup/local');
var config = local('config');
var schema = require('./index');

var conf;

function configuring () {
  return config.load().then(function (configObject) {
    conf = configObject;
  });
}

function drop () {
  return schema.knexAdmin().raw(`drop database ${conf.postgres.dbname};`).then(function () {
    console.log(`Database ${conf.postgres.dbname} dropped`);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function create () {
  return schema.knexAdmin().raw(`create database ${conf.postgres.dbname};`).then(function () {
    console.log(`Database ${conf.postgres.dbname} created`);
  }).catch(function (err) {
    console.log('Error:', err.message);
  });
}

function status () {
  return schema.knexAdmin()('pg_database').where({datname: conf.postgres.dbname}).select(schema.knexAdmin().raw('count(*) = 1 as exists')).then(function (rows) {
    var exists = rows[0].exists;
    if (exists) {
      return schema.knex().migrate.currentVersion();
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
  return schema.knex().migrate.latest().then(function (result) {
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
  return schema.configuring();
}).then(function () {
  return running(process.argv[2]);
}).then(function () {
  process.exit(0);
}).catch (function (err) {
  console.log('Error', err);
  process.exit(1);
});

