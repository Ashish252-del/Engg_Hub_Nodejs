"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "game_varient",
      [
        {
          name: "1 dollor",
          value: "1",
          status: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "2 dollor",
          value: "2",
          status: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("game_varient", null, {});
  },
};
