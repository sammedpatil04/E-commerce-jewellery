const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const testQuery = async () => {
  try {
    console.log('Testing daily order report query...');
    const result = await pool.query(`
      SELECT 
        DATE(o.created_at) as date, 
        p.name as product_name, 
        SUM(oi.quantity) as total_quantity
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY DATE(o.created_at), p.name
      ORDER BY DATE(o.created_at) DESC, total_quantity DESC
    `);
    console.log('Result rows:', result.rows);
    
    console.log('Checking orders table count:');
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders');
    console.log('Total orders:', ordersCount.rows[0].count);

    console.log('Checking order_items table count:');
    const itemsCount = await pool.query('SELECT COUNT(*) FROM order_items');
    console.log('Total order items:', itemsCount.rows[0].count);

  } catch (err) {
    console.error('Query failed:', err.message);
  } finally {
    await pool.end();
  }
};

testQuery();
