const Sequelize = require('sequelize');
const dbConfig = require('../config/db');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
      min: dbConfig.pool.min,
      max: dbConfig.pool.max,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.UserRoles = require('./user_roles')(sequelize, Sequelize);
db.Users = require('./users')(sequelize, Sequelize);
db.Discount = require('./discount')(sequelize, Sequelize); // Import Discount first
db.Products = require('./products')(sequelize, Sequelize); // Import Products after Discount
db.Payroll = require('./payroll')(sequelize, Sequelize);
// Initialize associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync all models in the correct order
const syncDatabase = async () => {
  try {
    // Drop existing tables if they exist
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Force sync Discount table to add new column
    await db.Discount.sync({ alter: true });
    console.log('Discount table synchronized with new columns');

    // Sync other tables normally
    await db.Products.sync();
    console.log('Products table synchronized');

    await db.UserRoles.sync();
    await db.Users.sync();

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1); // Exit if sync fails
  }
};

syncDatabase();

module.exports = db;
