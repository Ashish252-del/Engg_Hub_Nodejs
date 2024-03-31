'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return queryInterface.createTable("user_referral", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      referralUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userBonus: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      referralUserBonus: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

  down: async(queryInterface, Sequelize) => {
    return queryInterface.dropTable("user_referral");
  }
};
