const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is missing from .env file');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Render-hosted databases
    },
  },
  logging: false, // Disable query logging for cleaner output
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Render PostgreSQL database!');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

testConnection();

module.exports = sequelize;
