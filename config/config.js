module.exports = function (environment, secrets) {
  const common = {
    environment: environment,
    product: {
      id: 'neptune'
    }
  };
  
  const development = {
    postgres: {
      host: 'localhost',
      port: '5432',
      user: 'postgres',
      password: 'postgres',
      dbname: common.product.id,
      ssl: false
    }
  };

  const production = {
    postgres: {
      host: 'horton.elephantsql.com',
      port: '5432',
      user: 'pbktfksh',
      password: secrets['postgresql_password'],
      dbname: 'pbktfksh',
      ssl: true
    }
  };

  return Object.assign(common, {development, production}[environment]);
};
