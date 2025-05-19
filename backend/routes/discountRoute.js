const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
// Routes for discounts
router.post('/create', discountController.createDiscount);
router.post('/apply', discountController.applyDiscountToAllProducts);
router.get('/', discountController.getDiscounts);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);
module.exports = router;
