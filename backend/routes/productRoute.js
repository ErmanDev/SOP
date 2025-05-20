const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middlewares/multer');
const cloudinaryService = require('../services/cloudinaryService');

const router = express.Router();

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:product_id', productController.getProductById);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Upload product image and create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinaryService.uploadImage(
        req.file.path,
        'products'
      );
      req.body.image_url = result.secure_url;
    }
    await productController.createProduct(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload product image and update product
router.put('/:product_id', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinaryService.uploadImage(
        req.file.path,
        'products'
      );
      req.body.image_url = result.secure_url;
    }
    await productController.updateProduct(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:product_id', productController.deleteProduct);

// Update product stock
router.patch('/:product_id/stock', productController.updateProductStock);

// Update product status
router.patch('/:product_id/status', productController.updateProductStatus);

// Update product stock
router.put('/update-stock/:product_id', productController.updateProductStock);

module.exports = router;
