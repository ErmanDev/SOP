const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, 
  dialectOptions: process.env.NODE_ENV === "production" ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  } : {},
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Database");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

module.exports = { sequelize };
