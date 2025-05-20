'use strict';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '0',
      },
      membership: {
        type: DataTypes.ENUM('Silver', 'Gold', 'Platinum'),
        allowNull: false,
        defaultValue: 'Silver',
      },
      dateOfPurchase: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'customers',
      timestamps: true,
    }
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.Orders, {
      foreignKey: 'customerId',
      as: 'orders',
    });
    Customer.hasMany(models.Sales, {
      foreignKey: 'customerId',
      as: 'sales',
    });
    Customer.hasMany(models.Returns, {
      foreignKey: 'customerId',
      as: 'returns',
    });
  };

  return Customer;
};
