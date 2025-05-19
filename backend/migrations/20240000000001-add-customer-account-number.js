'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('customers', 'account_number', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: 'id',
    });

    await queryInterface.changeColumn('customers', 'totalAmount', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '0',
    });

    await queryInterface.addColumn('customers', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customers', 'account_number');
    await queryInterface.removeColumn('customers', 'image_url');
    await queryInterface.changeColumn('customers', 'totalAmount', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
