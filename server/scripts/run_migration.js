const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const migrationSql = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'weight_grams') THEN
        ALTER TABLE products ADD COLUMN weight_grams DECIMAL(10, 3) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'material_type') THEN
        ALTER TABLE products ADD COLUMN material_type VARCHAR(50) DEFAULT 'gold';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'diamond_carats') THEN
        ALTER TABLE products ADD COLUMN diamond_carats DECIMAL(10, 3) DEFAULT 0;
    END IF;
END $$;
`;

const runMigration = async () => {
    try {
        console.log('Running migration...');
        await pool.query(migrationSql);
        console.log('Migration completed successfully.');
        
        console.log('Updating existing products with default values...');
        // Update specific products with realistic weights
        await pool.query(`
            UPDATE products SET weight_grams = 15.5, material_type = 'gold' WHERE name = 'Royal Gold Necklace';
            UPDATE products SET weight_grams = 4.0, diamond_carats = 1.0, material_type = 'diamond' WHERE name = 'Diamond Stud Earrings';
            UPDATE products SET weight_grams = 3.5, material_type = 'gold' WHERE name = 'Sapphire Gold Ring';
            UPDATE products SET weight_grams = 8.2, material_type = 'gold' WHERE name = 'Ruby Pendant Chain';
            UPDATE products SET weight_grams = 5.0, material_type = 'platinum' WHERE name = 'Platinum Wedding Band';
            UPDATE products SET weight_grams = 6.0, material_type = 'gold' WHERE name = 'Emerald Drop Earrings';
            UPDATE products SET weight_grams = 12.0, diamond_carats = 3.5, material_type = 'diamond' WHERE name = 'Diamond Tennis Bracelet';
            UPDATE products SET weight_grams = 10.5, material_type = 'gold' WHERE name = 'Traditional Jhumka';
        `);
        console.log('Seed data updated.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
};

runMigration();
