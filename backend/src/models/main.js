const Sequelize = require('sequelize');
const dbConfig = require('../config/dbConfig.js');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  dialectOptions: {
    ssl: dbConfig.ssl,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./user')(sequelize, Sequelize);
db.userTypes = require('./userTypes')(sequelize, Sequelize);

db.Users.belongsTo(db.userTypes, { foreignKey: 'userType_id' });
db.userTypes.hasMany(db.Users, { foreignKey: 'userType_id' });

module.exports = db;

