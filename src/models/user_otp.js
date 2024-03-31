module.exports = (sequelize, DataTypes) => {
  const UserOTP = sequelize.define(
    "user_otp",
    {
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiresIn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "user_otp",
    }
  );
  UserOTP.associate = function (models) {
    UserOTP.belongsTo(models.user);
  };
  return UserOTP;
};
