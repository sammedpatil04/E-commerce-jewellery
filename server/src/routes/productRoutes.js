const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/rates/live-gold', productController.getLiveRates);
router.get('/:id', productController.getProductById);

module.exports = router;
