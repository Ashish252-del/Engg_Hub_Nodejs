module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    "transaction",
    {
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cash: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bonus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { freezeTableName: true }
  );
  transaction.associate = function (models) {
    transaction.belongsTo(models.user);
  };
  return transaction;
};
