"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            "game_type",
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
               
                status: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
               
            },
            { freezeTableName: true, timestamps: false }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("game_type");
    },
};
