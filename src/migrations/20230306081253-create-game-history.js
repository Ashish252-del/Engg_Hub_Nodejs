"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "game_history",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        gameId: {
          type: Sequelize.STRING,
        },
        tableId: {
          type: Sequelize.STRING,
        },
        userId: {
          type: Sequelize.STRING,
        },
        winAmount: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        betAmount: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        isWin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        fee: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          default: Sequelize.literal(`NOW()`),
        },
        updatedAt: {
          type: Sequelize.DATE,
          default: Sequelize.literal(`NOW()`),
        },
      },
      {
        freezeTableName: true,
        timestamp: true,
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("game_history");
  },
};
