const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/nagao/OneDrive/Desktop/Major Project/server/src/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD || '1122',
  port: process.env.DB_PORT || 5432,
});

async function listTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

listTables();
