const dotenv = require("dotenv");
const pkg = require("pg");

dotenv.config();
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing from .env file");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to Render PostgreSQL database!");
    client.release();
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

testConnection();

module.exports = pool; 