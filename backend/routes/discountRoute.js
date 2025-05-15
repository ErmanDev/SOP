const express = require('express');
const router = express.Router();
const {
  createDiscount,
  applyDiscountToAllProducts,
  getDiscounts,
} = require('../controllers/discountController');

// Routes for discounts
router.post('/create', createDiscount);
router.post('/apply', applyDiscountToAllProducts);
router.get('/', getDiscounts);

module.exports = router;
