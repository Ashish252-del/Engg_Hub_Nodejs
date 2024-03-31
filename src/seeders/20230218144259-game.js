"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "game",
      [
        {
          name: "game 1",
          varient_id: "1",
          type_id: "4",
          status: "1",
          comission: "10",
          cap: "20",
        },
        {
          name: "game 2",
          varient_id: "1",
          type_id: "5",
          status: "1",
          comission: "20",
          cap: "40",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("game", null, {});
  },
};
