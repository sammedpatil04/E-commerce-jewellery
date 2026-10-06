const { pool } = require('../src/config/db');

async function migrate() {
  try {
    console.log('Adding columns to products table...');
    
    // Add weight_grams
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS weight_grams DECIMAL(10,3) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS material_type VARCHAR(50) DEFAULT 'gold',
      ADD COLUMN IF NOT EXISTS diamond_carats DECIMAL(10,3) DEFAULT 0
    `);

    console.log('Columns added successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

migrate();
