'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
    queryInterface.addColumn(
      'game_type', // table name
      'icon', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'game_type', // table name
      'description', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('game_type', 'icon'),
      queryInterface.removeColumn('game_type', 'description'),
     
    ]);
  }
};
