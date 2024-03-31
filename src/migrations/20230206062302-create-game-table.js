module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "game",
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
        varient_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "game_varient",
            key: "id",
          },
        },

        type_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "game_type",
            key: "id",
          },
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        comission: {
          type: Sequelize.STRING,
        },
        cap: {
          type: Sequelize.STRING,
        },
      },
      { freezeTableName: true, timestamps: false }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("game");
  },
};
