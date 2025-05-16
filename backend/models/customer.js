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
      allowNull: false,
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
  },
  {
    tableName: 'customers',
    timestamps: false,
  }
);

module.exports = Customer;
