module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "User",
      },
      kyc: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "No",
      },
      mobile: {
        type: Sequelize.STRING,
      },

      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      profilePic: {
        type: Sequelize.STRING,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isMobileVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Users"),
};
