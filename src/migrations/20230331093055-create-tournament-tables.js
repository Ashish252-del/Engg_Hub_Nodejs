'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tournament_tables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tournamentId: {
        type: Sequelize.INTEGER
      },
      tableId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      status:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      winnerId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:-1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      freezeTableName: true 
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tournament_tables');
  }
};