const axios = require('axios');

async function testCreateProduct() {
  try {
    const productData = {
      name: "Test Gold Ring",
      description: "A test ring for verification",
      image_url: "https://example.com/ring.jpg",
      category_id: 2,
      is_featured: false,
      weight_grams: 5.5,
      material_type: "gold",
      diamond_carats: 0
    };

    const response = await axios.post('http://localhost:3000/api/admin/products', productData);
    console.log('Product Created:', response.data);

    // Verify fetching it back
    // Since we don't know the ID, let's just fetch all products and check the last one or filter
    const productsRes = await axios.get('http://localhost:3000/api/products');
    const createdProduct = productsRes.data.find(p => p.name === "Test Gold Ring");
    
    if (createdProduct) {
        console.log('Product Found in List:', createdProduct);
        console.log('Weight:', createdProduct.weight_grams);
        console.log('Material:', createdProduct.material_type);
        // calculated 'price' (making charges)
        console.log('Stored Price (Making Charges):', createdProduct.price);
    } else {
        console.log('Product NOT found in list.');
    }

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testCreateProduct();
