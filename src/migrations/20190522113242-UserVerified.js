

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'verifyToken', {
      type: Sequelize.STRING,
      defaultValue: null,
    }),
    queryInterface.addColumn('users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('users', 'verifyToken'),
    queryInterface.removeColumn('users', 'isVerified'),
  ]),
};
