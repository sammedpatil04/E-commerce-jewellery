const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

const seedData = async () => {
  try {
    const sqlPath = path.join(__dirname, '../../additional_seed.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Seeding additional data...');
    await pool.query(sql);
    console.log('Data seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await pool.end();
  }
};

seedData();
