module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_otp", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      otp: {
        type: Sequelize.STRING,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      expiresIn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable("user_otp");
  },
};
