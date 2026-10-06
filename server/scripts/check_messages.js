const { pool } = require('../src/config/db');

async function checkMessages() {
  try {
    const res = await pool.query('SELECT * FROM contact_messages');
    console.log('Messages count:', res.rows.length);
    console.log('Messages:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkMessages();
