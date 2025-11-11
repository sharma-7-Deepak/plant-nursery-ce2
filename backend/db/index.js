// backend/db/index.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'plant_admin',
  password: process.env.PGPASSWORD || 'Plant@123', // use your actual password
  database: process.env.PGDATABASE || 'plantnursery_db',
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL successfully:', res.rows[0].now);
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
  } finally {
    pool.end();
  }
}

testConnection();
