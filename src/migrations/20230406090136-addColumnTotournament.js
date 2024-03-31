'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('tournaments', 'title', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await  queryInterface.addColumn('tournaments', 'playerType', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue:2
    });
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tournaments', 'title');
    await queryInterface.removeColumn('tournaments', 'playerType');

  }
};
