const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/nagao/OneDrive/Desktop/Major Project/server/src/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD || '1122',
  port: process.env.DB_PORT || 5432,
});

async function checkTriggers() {
  try {
    const res = await pool.query(`
      SELECT trigger_name, event_manipulation, event_object_table, action_statement 
      FROM information_schema.triggers
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkTriggers();
