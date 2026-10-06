const { pool } = require('../config/db');

exports.createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, shippingDetails = {} } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    await client.query('BEGIN');

    // Calculate total and verify products
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const res = await client.query('SELECT price FROM products WHERE id = $1', [item.productId]);
      if (res.rows.length === 0) {
        throw new Error(`Product ${item.productId} not found`);
      }
      const product = res.rows[0];
      const itemTotal = Number(product.price) * item.quantity;
      total += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Insert Order with shipping details
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, customer_name, shipping_address, contact_number, email, payment_method, estimated_delivery_date) 
       VALUES ($1, $2, 'pending', $3, $4, $5, $6, 'COD', CURRENT_DATE + INTERVAL '7 days') 
       RETURNING id`,
      [
        userId,
        total,
        shippingDetails.customer_name || null,
        shippingDetails.shipping_address || null,
        shippingDetails.contact_number || null,
        shippingDetails.email || null
      ]
    );
    const orderId = orderRes.rows[0].id;

    // Insert Order Items
    for (const item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  } finally {
    client.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
