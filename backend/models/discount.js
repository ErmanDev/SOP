module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    'Discount',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('occasional', 'seasonal'),
        allowNull: false,
      },
      percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      categories: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: ['all'],
        validate: {
          isValidCategories(value) {
            const validCategories = [
              'all',
              'Home Appliance',
              'Gadgets',
              'Furnitures',
              'Smart Home',
            ];
            if (!Array.isArray(value)) {
              throw new Error('Categories must be an array');
            }
            if (value.length === 0) {
              throw new Error('Must select at least one category');
            }
            if (value.some((cat) => !validCategories.includes(cat))) {
              throw new Error(
                `Categories must be one of: ${validCategories.join(', ')}`
              );
            }
          },
        },
      },
    },
    {
      tableName: 'Discounts',
      timestamps: true,
    }
  );

  // Define associations
  Discount.associate = function (models) {
    Discount.hasMany(models.Products, {
      foreignKey: 'discountId',
      as: 'products',
    });
  };

  // Force sync the model to add the new column
  Discount.sync({ alter: true })
    .then(() => {
      console.log('Discount table altered successfully');
    })
    .catch((error) => {
      console.error('Error altering Discount table:', error);
    });

  return Discount;
};
