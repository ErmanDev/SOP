const db = require('../models/main'); // Your models index
const Discount = db.Discount;
const Product = db.Products;
const { Op } = require('sequelize');

// Create a new discount
exports.createDiscount = async (req, res) => {
  try {
    const {
      name,
      type,
      percentage,
      startDate,
      endDate,
      categories = ['all'],
    } = req.body;

    if (!name || !type || percentage === undefined || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: { name, type, percentage, startDate, endDate },
      });
    }

    // Validate percentage
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({
        message: 'Percentage must be between 0 and 100',
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format',
      });
    }

    if (start > end) {
      return res.status(400).json({
        message: 'Start date must be before end date',
      });
    }

    // Create the discount
    const discount = await Discount.create({
      name,
      type,
      percentage,
      startDate: start,
      endDate: end,
      categories,
    });

    // Apply discount to products based on categories
    await db.sequelize.transaction(async (t) => {
      const whereClause = categories.includes('all')
        ? {}
        : { category: { [Op.in]: categories } };

      // Get current date to check if discount should be active
      const currentDate = new Date();
      const isActive = currentDate >= start && currentDate <= end;

      await Product.update(
        {
          discount_percentage: isActive ? percentage : 0,
          discountId: discount.id,
          discount_startDate: discount.startDate,
          discount_endDate: discount.endDate,
        },
        {
          where: whereClause,
          transaction: t,
          fields: [
            'discount_percentage',
            'discountId',
            'discount_startDate',
            'discount_endDate',
          ],
        }
      );
    });

    // Fetch the updated products to confirm changes
    const whereClause = categories.includes('all')
      ? { discountId: discount.id }
      : {
          discountId: discount.id,
          category: { [Op.in]: categories },
        };

    const updatedProducts = await Product.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'category', 'discount_percentage'],
    });

    res.status(201).json({
      message: `Discount created and applied to ${updatedProducts.length} products successfully`,
      discount: discount,
      affectedProducts: updatedProducts.length,
      products: updatedProducts,
    });
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({
      message: 'Failed to create discount',
      error: error.message,
    });
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
    const discounts = await Discount.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'category', 'discount_percentage'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Update discount percentages based on current date
    const currentDate = new Date();
    for (const discount of discounts) {
      const isActive =
        currentDate >= discount.startDate && currentDate <= discount.endDate;
      if (
        !isActive &&
        discount.products.some((p) => p.discount_percentage > 0)
      ) {
        await Product.update(
          { discount_percentage: 0 },
          { where: { discountId: discount.id } }
        );
      }
    }

    res.status(200).json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res
      .status(500)
      .json({ message: 'Error fetching discounts', error: error.message });
  }
};

// Delete a discount
exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    await db.sequelize.transaction(async (t) => {
      // First, remove the discount from all products
      await Product.update(
        {
          discount_percentage: 0,
          discountId: null,
          discount_startDate: null,
          discount_endDate: null,
        },
        {
          where: { discountId: id },
          transaction: t,
          fields: [
            'discount_percentage',
            'discountId',
            'discount_startDate',
            'discount_endDate',
          ],
        }
      );

      // Then delete the discount
      const deleted = await Discount.destroy({
        where: { id },
        transaction: t,
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Discount not found' });
      }
    });

    res
      .status(200)
      .json({
        message: 'Discount deleted and removed from all products successfully',
      });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res
      .status(500)
      .json({ message: 'Error deleting discount', error: error.message });
  }
};

// Update a discount
exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      percentage,
      startDate,
      endDate,
      categories = ['all'],
    } = req.body;

    if (!name || !type || percentage === undefined || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: { name, type, percentage, startDate, endDate },
      });
    }

    // Validate percentage
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({
        message: 'Percentage must be between 0 and 100',
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format',
      });
    }

    if (start > end) {
      return res.status(400).json({
        message: 'Start date must be before end date',
      });
    }

    await db.sequelize.transaction(async (t) => {
      // Update the discount
      const [updated] = await Discount.update(
        {
          name,
          type,
          percentage,
          startDate: start,
          endDate: end,
          categories,
        },
        {
          where: { id },
          transaction: t,
        }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Discount not found' });
      }

      // Update products with new discount values
      const whereClause = categories.includes('all')
        ? { discountId: id }
        : {
            discountId: id,
            category: { [Op.in]: categories },
          };

      // Get current date to check if discount should be active
      const currentDate = new Date();
      const isActive = currentDate >= start && currentDate <= end;

      await Product.update(
        {
          discount_percentage: isActive ? percentage : 0,
          discount_startDate: start,
          discount_endDate: end,
        },
        {
          where: whereClause,
          transaction: t,
          fields: [
            'discount_percentage',
            'discount_startDate',
            'discount_endDate',
          ],
        }
      );

      // For products in categories that are no longer included, remove the discount
      if (!categories.includes('all')) {
        await Product.update(
          {
            discount_percentage: 0,
            discountId: null,
            discount_startDate: null,
            discount_endDate: null,
          },
          {
            where: {
              discountId: id,
              category: { [Op.notIn]: categories },
            },
            transaction: t,
            fields: [
              'discount_percentage',
              'discountId',
              'discount_startDate',
              'discount_endDate',
            ],
          }
        );
      }
    });

    // Fetch the updated discount with its products
    const updatedDiscount = await Discount.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'category', 'discount_percentage'],
        },
      ],
    });

    res.status(200).json({
      message: 'Discount updated successfully',
      discount: updatedDiscount,
    });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({
      message: 'Failed to update discount',
      error: error.message,
    });
  }
};
