module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    'Products',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(
          'Home Appliance',
          'Gadgets',
          'Furnitures',
          'Smart Home'
        ),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'https://source.unsplash.com/200x200/?product',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
      discount_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      discount_startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      discount_endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      discountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Discounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'Products',
      timestamps: true,
    }
  );

  Products.beforeValidate((product, options) => {
    // Skip validation if we're only updating discount fields
    const discountFields = [
      'discount_percentage',
      'discountId',
      'discount_startDate',
      'discount_endDate',
    ];

    if (options && options.fields) {
      const nonDiscountFields = options.fields.filter(
        (field) => !discountFields.includes(field)
      );

      // Skip validation if only updating discount fields
      if (nonDiscountFields.length === 0) {
        return;
      }
    }

    // Only validate category if it's being updated
    if (product.changed('category')) {
      const validCategories = [
        'Home Appliance',
        'Gadgets',
        'Furnitures',
        'Smart Home',
      ];
      if (!validCategories.includes(product.category)) {
        throw new Error(
          `Invalid category: ${
            product.category
          }. Must be one of: ${validCategories.join(', ')}`
        );
      }
    }
  });

  // Add hook to update discount_percentage when discountId changes
  Products.beforeUpdate((product, options) => {
    const currentDate = new Date();

    // If discountId is being removed, reset discount fields
    if (product.changed('discountId') && !product.discountId) {
      product.discount_percentage = 0;
      product.discount_startDate = null;
      product.discount_endDate = null;
      return;
    }

    // Check if discount is active based on dates
    if (product.discount_startDate && product.discount_endDate) {
      const startDate = new Date(product.discount_startDate);
      const endDate = new Date(product.discount_endDate);

      if (currentDate >= startDate && currentDate <= endDate) {
        // Discount is active, keep the percentage
        return;
      } else {
        // Discount is not active, reset percentage
        product.discount_percentage = 0;
      }
    }
  });

  // Association for Discount (foreign key)
  Products.associate = function (models) {
    Products.belongsTo(models.Discount, {
      foreignKey: 'discountId',
      as: 'discount',
    });
  };

  return Products;
};
