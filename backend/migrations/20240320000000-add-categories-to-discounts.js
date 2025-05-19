'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Discounts', 'categories', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: ['all'],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Discounts', 'categories');
  },
};
