const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "pms_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1q2w3e4r5t",
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✓ PostgreSQL connected successfully");
    return true;
  } catch (error) {
    console.warn("✗ PostgreSQL connection failed:", error.message);
    console.warn("  Server running in development mode without database");
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
};
