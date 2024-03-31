'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.addColumn ('game_history', 'Score' , {
    type: Sequelize.STRING,
    allowNull: false,
      defaultValue: 0
   })
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn ('game_history', 'Score')
  }
};
