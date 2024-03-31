module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "Users",
      [
        {
          mobile: "9910188805",
          email: "admin@gmail.com",
          password: "e10adc3949ba59abbe56e057f20f883e",
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          mobile: "9910188800",
          email: "user@gmail.com",
          password: "e10adc3949ba59abbe56e057f20f883e",
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("users", null, {}),
};
