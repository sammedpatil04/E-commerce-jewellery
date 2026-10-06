const { query } = require('../config/db');
const { fetchLiveRates, calculateProductPrice } = require('../services/priceService');

exports.getProducts = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id`
    );
    const rates = await fetchLiveRates();
    const productsWithLivePrices = result.rows.map(p => calculateProductPrice(p, rates));
    res.json(productsWithLivePrices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const rates = await fetchLiveRates();
    const productWithLivePrice = calculateProductPrice(result.rows[0], rates);

    res.json(productWithLivePrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getLiveRates = async (req, res) => {
  try {
    const rates = await fetchLiveRates();
    res.json(rates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

