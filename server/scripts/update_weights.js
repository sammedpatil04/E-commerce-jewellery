const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const updateWeights = async () => {
    try {
        console.log('Updating product weights...');
        
        // Update specific products with realistic exact weights
        await pool.query(`
            UPDATE products SET weight_grams = 15.5 WHERE name = 'Royal Gold Necklace';
            UPDATE products SET weight_grams = 4.2 WHERE name = 'Diamond Stud Earrings';
            UPDATE products SET weight_grams = 3.8 WHERE name = 'Sapphire Gold Ring';
            UPDATE products SET weight_grams = 8.5 WHERE name = 'Ruby Pendant Chain';
            UPDATE products SET weight_grams = 5.2 WHERE name = 'Platinum Wedding Band';
            UPDATE products SET weight_grams = 6.4 WHERE name = 'Emerald Drop Earrings';
            UPDATE products SET weight_grams = 12.5 WHERE name = 'Diamond Tennis Bracelet';
            UPDATE products SET weight_grams = 10.8 WHERE name = 'Traditional Jhumka';
            
            -- Ensure any other products have at least some weight to avoid 0 price
            UPDATE products SET weight_grams = 5.0 WHERE weight_grams = 0 OR weight_grams IS NULL;
        `);
        console.log('Product weights updated.');
    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        await pool.end();
    }
};

updateWeights();
