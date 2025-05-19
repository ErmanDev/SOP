'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('./main').sequelize;

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
  },
  {
    tableName: 'customers',
    timestamps: false,
  }
);

module.exports = Customer;
