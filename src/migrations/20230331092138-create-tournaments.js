'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tournaments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameTypeId: {
        type: Sequelize.INTEGER
      },
      duration: {
        type: Sequelize.INTEGER
      },
      playerSize: {
        type: Sequelize.INTEGER
      },
      winningAmount: {
        type: Sequelize.INTEGER
      },
      entryFee:{
        type:Sequelize.INTEGER
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
      scheduledDate:{
        type: 'TIMESTAMP'
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
    return queryInterface.dropTable('tournaments');
  }
};