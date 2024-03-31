'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('registered_user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      tourneyId: {
        type: Sequelize.INTEGER
      },
      tableId:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'0'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      freezeTableName: true 
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('registered_user');
  }
};