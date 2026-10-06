const adminController = require('../src/controllers/adminController');
const { pool } = require('../src/config/db');

async function testGetAllOrders() {
  try {
    const req = {};
    const res = {
      json: function(data) {
        this.jsonData = data;
        return this;
      }
    };

    console.log('Calling adminController.getAllOrders...');
    await adminController.getAllOrders(req, res);
    console.log('Success!');
    // console.log(res.jsonData);
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await pool.end();
  }
}

testGetAllOrders();
