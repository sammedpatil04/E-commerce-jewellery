const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/nagao/OneDrive/Desktop/Major Project/server/src/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jewelry_store',
  password: process.env.DB_PASSWORD || '1122',
  port: process.env.DB_PORT || 5432,
});

async function testLifecycle() {
  try {
    // 1. Create a product
    console.log('Creating test product...');
    const createRes = await pool.query(
      'INSERT INTO products (name, description, price, image_url, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Diagnostic Test Product', 'Test product', 100, 'http://test.com', 1]
    );
    const productId = createRes.rows[0].id;
    console.log('Created product with ID:', productId);

    // 2. Add it to an order item to test the constraint
    console.log('Creating test order...');
    const orderRes = await pool.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (NULL, 100, "pending") RETURNING id'
    ).catch(async (err) => {
        // If user_id NULL is not allowed or orders table differs
        console.log('Finding a user to link the order...');
        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        const userId = userRes.rows[0]?.id || null;
        return await pool.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, 100, $2) RETURNING id',
            [userId, 'pending']
        );
    });
    const orderId = orderRes.rows[0].id;
    console.log('Created order with ID:', orderId);

    console.log('Creating order item...');
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
      [orderId, productId, 1, 100]
    );
    console.log('Linked product to order.');

    // 3. Try to delete the product
    console.log('Attempting to delete product...');
    const deleteRes = await pool.query('DELETE FROM products WHERE id = $1 RETURNING name', [productId]);
    console.log('Delete result count:', deleteRes.rowCount);
    if (deleteRes.rowCount > 0) {
        console.log('Successfully deleted product:', deleteRes.rows[0].name);
        
        // Check order_items
        const checkRes = await pool.query('SELECT product_id FROM order_items WHERE order_id = $1', [orderId]);
        console.log('Order item product_id after deletion:', checkRes.rows[0].product_id);
    } else {
        console.log('Failed to delete product - rowCount is 0');
    }

  } catch (err) {
    console.error('Lifecycle test failed with error:');
    console.error(err);
    if (err.code) console.error('Error Code:', err.code);
  } finally {
    // Cleanup order/items? Maybe not needed for diagnostic
    await pool.end();
  }
}

testLifecycle();
