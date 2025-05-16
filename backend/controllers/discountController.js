const db = require('../models/main'); // Your models index
const Discount = db.Discounts;
const Product = db.Products;

// Create a new discount
exports.createDiscount = async (req, res) => {
  try {
    console.log('Request payload:', req.body);

    const discount = await Discount.create(req.body); // Sequelize .create()

    res.status(201).json(discount);
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({ message: 'Error creating discount', error });
  }
};

// Apply discount to all products
exports.applyDiscountToAllProducts = async (req, res) => {
  try {
    const { discountId, percentage } = req.body;

    let discountPercentage;

    if (discountId) {
      const discount = await Discount.findByPk(discountId);
      if (!discount) {
        return res.status(404).json({ message: 'Discount not found' });
      }
      discountPercentage = discount.percentage;
    } else if (percentage) {
      discountPercentage = percentage;
    } else {
      return res.status(400).json({
        message: 'No discountId or percentage provided',
      });
    }

    await Product.update({ discount: discountPercentage }, { where: {} });

    res.status(200).json({
      message: `Discount of ${discountPercentage}% applied to all products`,
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    res.status(500).json({ message: 'Error applying discount', error });
  }
};

// Get all discounts
exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.findAll(); // Sequelize method
    res.status(200).json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ message: 'Error fetching discounts', error });
  }
};

// Delete a discount
exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByPk(id);

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    await discount.destroy();
    res.status(200).json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ message: 'Error deleting discount', error });
  }
};
