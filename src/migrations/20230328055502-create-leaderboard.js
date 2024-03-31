'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('leaderboard', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rank: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      gamePlayed: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue:0
      },
    },{
      timestamps: false ,
      freezeTableName: true 
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('leaderboard');
  }
};