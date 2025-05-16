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
  });

  // Association for Discount (foreign key)
  Products.associate = function (models) {
    Products.belongsTo(models.Discounts, {
      foreignKey: 'discountId',
      as: 'discount',
    });
  };

  return Products;
};
