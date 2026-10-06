const axios = require('axios');

async function testDeleteApi() {
  try {
    const baseURL = 'http://localhost:3000/api';
    
    // 1. Login as admin to get token
    console.log('Logging in as admin...');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com', // Assuming this admin exists
      password: 'admin' // Assuming this password
    }).catch(async () => {
        // Try another if failed
        return await axios.post(`${baseURL}/auth/login`, {
            email: 'admin@admin.com',
            password: 'admin'
        });
    });
    
    const token = loginRes.data.token;
    console.log('Logged in successfully.');

    // 2. Create a product via Admin API
    console.log('Creating product...');
    const createRes = await axios.post(`${baseURL}/admin/products`, {
      name: "API Test Product",
      description: "Test",
      image_url: "http://test.com",
      category_id: 1,
      weight_grams: 10,
      material_type: "gold"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Product created.');

    // 3. Find the product ID
    const productsRes = await axios.get(`${baseURL}/products`);
    const product = productsRes.data.find(p => p.name === "API Test Product");
    const productId = product.id;
    console.log('Product ID:', productId);

    // 4. Delete the product
    console.log('Deleting product...');
    const deleteRes = await axios.delete(`${baseURL}/admin/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Delete Response:', deleteRes.data);

  } catch (err) {
    console.error('API Test failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testDeleteApi();
