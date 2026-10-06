const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

const setupDatabase = async () => {
  try {
    const sqlPath = path.join(__dirname, '../../database_pg.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running database setup...');
    await pool.query(sql);
    console.log('Database setup completed successfully.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await pool.end();
  }
};

setupDatabase();
