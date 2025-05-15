const Discount = require('../models/discount');
const Product = require('../models/products');
const db = require('../models/main');

// Create a new discount
exports.createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ message: 'Error creating discount', error });
  }
};

// Apply discount to all products
exports.applyDiscountToAllProducts = async (req, res) => {
  try {
    const { discountId, percentage } = req.body;

    let discountPercentage;

    if (discountId) {
      const discount = await db.Discounts.findByPk(discountId);

      if (!discount) {
        return res.status(404).json({ message: 'Discount not found' });
      }

      discountPercentage = discount.percentage;
    } else if (percentage) {
      discountPercentage = percentage;
    } else {
      return res.status(400).json({ message: 'No discountId or percentage provided' });
    }

    await db.Products.update(
      { discount: discountPercentage },
      { where: {} } // Apply to all products
    );

    res.status(200).json({ message: `Discount of ${discountPercentage}% applied to all products` });
  } catch (error) {
    res.status(500).json({ message: 'Error applying discount', error });
  }
};

// Get all discounts
exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discounts', error });
  }
};
