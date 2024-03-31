"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "game_type",
      [
        {
          name: "CLASSIC LUDO",
          icon: "icon",
          description: "TAKE YOUR 4 PAWNS/GOTIS HOME",
          status: "1",
        },
        {
          name: "QUICK LUDO",
          icon: "icon",
          description: "TAKE YOUR 2 PAWNS/GOTIS HOME",
          status: "1",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("game_type", null, {});
  },
};
