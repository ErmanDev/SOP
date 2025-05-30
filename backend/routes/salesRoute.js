const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/salesController');

router.get('/', SalesController.getAllSales);
router.get('/dashboard', SalesController.getDashboardStats);
router.get('/chart', SalesController.getChartData);
router.post('/create', SalesController.createSale);
router.get('/customer-sales-summary', SalesController.getCustomerSalesSummary);

module.exports = router;
