'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'referralCode', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'referralCode');
  }
};
