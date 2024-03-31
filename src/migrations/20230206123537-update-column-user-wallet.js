"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "user_wallet", // table name
        "mainBalance", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        "user_wallet", // table name
        "winningBalance", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        "user_wallet", // table name
        "bonusBalance", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        "user_wallet", // table name
        "bet", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("user_wallet", "mainBalance"),
      queryInterface.removeColumn("user_wallet", "winningBalance"),
      queryInterface.removeColumn("user_wallet", "bonusBalance"),
      queryInterface.removeColumn("user_wallet", "bet"),
    ]);
  },
};
