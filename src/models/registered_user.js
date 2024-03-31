'use strict';
module.exports = (sequelize, DataTypes) => {
  const registered_user = sequelize.define('registered_user', {
    userId: {
      type: DataTypes.INTEGER
    },
    tableId:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:'0'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull : false,
      defaultValue:0
    }
  }, {
    freezeTableName: true 
  });
  registered_user.associate = function(models) {
    // associations can be defined here
    // registered_user.belongsTo(models.tournaments,{
    //   foreignKey: "tourneyId"
    // })
  };
  return registered_user;
};