module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_wallet", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      setAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      withdrawable: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lose: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
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
    return queryInterface.dropTable("user_wallet");
  },
};
