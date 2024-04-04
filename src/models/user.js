module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      firstname: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Username already in use!",
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "User",
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Mobile already in use!",
        },
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "No",
      },
        roleCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email already in use!",
        },
      },

      password: {
        type: DataTypes.STRING,
      },
      profilePic: {
        type: DataTypes.STRING,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      isProfileUpdated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isTermAccepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      clientCode: {
        type:DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      jsonData:{
        type: DataTypes.STRING,
        allowNull:true
      }
    },
    {
      defaultScope: {
        attributes: { exclude: ["password", "verifyToken", "isAdmin"] },
      },
      scopes: {
        withSecretColumns: {
          attributes: { include: ["password", "verifyToken", "isAdmin"] },
        },
      },
    }
  );
  User.associate = function (models) {
    // User.hasMany(models.registered_user, {
    //   foreignKey: "uuid",
    // });
    // User.hasMany(models.user_otp, {
    //   foreignKey: "userId",
    // });
    // User.hasMany(models.game_history, {
    //   foreignKey: "userId",
    // });

    // User.hasMany(models.transaction, {
    //   foreignKey: "userId"
    // })
  };

  User.addHook("afterCreate", async (user, options) => {
    if (!user.isAdmin) {
      await User.update(
        { username: "user" + user.id },
        {
          where: {
            isAdmin: false,
            id: user.id,
          },
          transaction: options.transaction,
        }
      );
    }
  });

  return User;
};
