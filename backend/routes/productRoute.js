const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:product_id', productController.getProductById);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Create new product
router.post('/', productController.createProduct);

// Update product
router.put('/:product_id', productController.updateProduct);

// Delete product
router.delete('/:product_id', productController.deleteProduct);

// Update product stock
router.patch('/:product_id/stock', productController.updateProductStock);

// Update product status
router.patch('/:product_id/status', productController.updateProductStatus);

module.exports = router; 