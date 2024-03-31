module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "game_varient",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        value: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      { freezeTableName: true }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("game_varient");
  },
};
