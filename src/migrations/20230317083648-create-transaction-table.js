"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transaction", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transactionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cash: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      bonus: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      reference: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transaction");
  },
};
