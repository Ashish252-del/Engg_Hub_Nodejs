'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tournaments', 'duration');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tournaments', 'duration', {
      type:Sequelize.STRING
    });
  }
};
