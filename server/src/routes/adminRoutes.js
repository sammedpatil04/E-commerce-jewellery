const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protect all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Order Management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', adminController.updateOrderStatus);

// Product Management
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Reports Management
router.get('/reports/customers', adminController.getCustomersReport);
router.get('/reports/orders-daily', adminController.getDailyOrdersReport);
router.get('/reports/sales-daily', adminController.getDailySalesReport);
router.get('/reports/trending', adminController.getTrendingProductsReport);
router.get('/reports/feedback', adminController.getFeedbackReport);
router.get('/reports/categories', adminController.getCategoriesReport);

module.exports = router;
