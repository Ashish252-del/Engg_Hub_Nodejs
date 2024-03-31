module.exports = (sequelize, DataTypes) => {
  const user_wallet = sequelize.define(
    "user_wallet",
    {
      setAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mainBalance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      winningBalance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bonusBalance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      withdrawable: {
        type: DataTypes.INTEGER,
      },
      wins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bet: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { freezeTableName: true }
  );
  user_wallet.associate = function (models) {
    user_wallet.belongsTo(models.user,{
      foreignKey: "userId",
    });
  };
  return user_wallet;
};
