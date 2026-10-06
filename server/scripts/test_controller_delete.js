require('dotenv').config({ path: require('path').resolve(__dirname, '../src/.env') });
const adminController = require('../src/controllers/adminController');
const { pool } = require('../src/config/db');

async function testControllerDelete() {
  try {
    // 1. Create a product
    console.log('Creating test product...');
    const createRes = await pool.query(
      'INSERT INTO products (name, description, price, image_url, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Controller Test Product', 'Test', 100, 'http://test.com', 1]
    );
    const productId = createRes.rows[0].id;
    console.log('Created product with ID:', productId);

    // 2. Call controller.deleteProduct
    const req = { params: { id: productId } };
    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.jsonData = data;
        return this;
      }
    };

    console.log('Calling adminController.deleteProduct...');
    await adminController.deleteProduct(req, res);

    console.log('Response Status:', res.statusCode || 200);
    console.log('Response Data:', res.jsonData);

  } catch (err) {
    console.error('Controller test failed:', err);
  } finally {
    await pool.end();
  }
}

testControllerDelete();
