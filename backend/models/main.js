const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

// Use the configuration based on the current environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.Products = require('./products')(sequelize, Sequelize);
db.Orders = require('./order')(sequelize, Sequelize);
db.Sales = require('./sale')(sequelize, Sequelize);
db.Returns = require('./return')(sequelize, Sequelize);
db.Customers = require('./customer')(sequelize, Sequelize);
db.UserRoles = require('./user_roles')(sequelize, Sequelize);
db.Users = require('./users')(sequelize, Sequelize);
db.Discount = require('./discount')(sequelize, Sequelize);
db.Payroll = require('./payroll')(sequelize, Sequelize);

// Initialize associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Sync models with the database
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = db;
