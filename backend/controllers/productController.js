const db = require('../models/main');
const { Op } = require('sequelize');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.Products.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await db.Products.findOne({
      where: { product_id: req.params.product_id },
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await db.Products.findAll({
      where: { category: req.params.category },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      image_url,
      description,
      stock_quantity,
      discount_percentage,
    } = req.body;

    // Generate product_id
    const product_id = `PROD-${Date.now()}`;

    const product = await db.Products.create({
      product_id,
      name,
      price,
      category,
      image_url,
      description,
      stock_quantity,
      discount_percentage: discount_percentage || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      image_url,
      description,
      stock_quantity,
      status,
      discount_percentage,
    } = req.body;

    const [updated] = await db.Products.update(
      {
        name,
        price,
        category,
        image_url,
        description,
        stock_quantity,
        status,
        discount_percentage: discount_percentage || 0,
      },
      {
        where: { id: req.params.product_id },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await db.Products.findOne({
      where: { id: req.params.product_id },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await db.Products.destroy({
      where: { id: req.params.product_id }, // Use `id` instead of `product_id`
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product stock
exports.updateProductStock = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;

    const product = await db.Products.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await product.update({
      stock_quantity: product.stock_quantity - quantity,
    });

    res.json({
      message: 'Stock updated successfully',
      product,
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update product status
exports.updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const [updated] = await db.Products.update(
      { status },
      {
        where: { product_id: req.params.product_id },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await db.Products.findOne({
      where: { product_id: req.params.product_id },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
