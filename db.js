// db.js - Postgres connection pool using dotenv
const { Pool } = require('pg');
require('dotenv').config();

// Check for the presence of the DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL env var not set. Postgres connection may fail.');
}

// Create a new pool instance using the connection string from the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the pool instance for use in other modules
module.exports = pool;
