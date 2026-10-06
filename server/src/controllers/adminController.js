const { pool } = require('../config/db');

// Get all orders (Admin view)
exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, category_id, is_featured, weight_grams, material_type, diamond_carats } = req.body;
    await pool.query(
      'INSERT INTO products (name, description, price, image_url, category_id, is_featured, weight_grams, material_type, diamond_carats) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [name, description, price, image_url, category_id, is_featured || false, weight_grams || 0, material_type || 'gold', diamond_carats || 0]
    );
    res.status(201).json({ message: 'Product created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, is_featured, weight_grams, material_type, diamond_carats } = req.body;
    await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, image_url=$4, category_id=$5, is_featured=$6, weight_grams=$7, material_type=$8, diamond_carats=$9 WHERE id=$10',
      [name, description, price, image_url, category_id, is_featured, weight_grams || 0, material_type || 'gold', diamond_carats || 0, id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// -- Reports API endpoints --

exports.getCustomersReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.name, u.email, u.created_at, COUNT(o.id) as total_orders
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getDailyOrdersReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(o.created_at) as date, p.name as product_name, SUM(oi.quantity) as total_quantity
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       GROUP BY DATE(o.created_at), p.name
       ORDER BY date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getDailySalesReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(created_at) as date, SUM(total_amount) as total_sales
       FROM orders
       WHERE status != 'cancelled'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getTrendingProductsReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.name, p.image_url, COALESCE(SUM(oi.quantity), 0) as total_sold
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getFeedbackReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT created_at, name, email, message
       FROM contact_messages
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getCategoriesReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.name, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id
       ORDER BY c.id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
