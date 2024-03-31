'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'facebookUserId', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'facebookUserId');
  }
};
