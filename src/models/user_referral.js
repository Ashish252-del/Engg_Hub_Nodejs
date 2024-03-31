module.exports = (sequelize, DataTypes) => {
    const user_referral = sequelize.define(
        "user_referral",
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            referralUserId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            userBonus: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            referralUserBonus: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            }
        },
        { freezeTableName: true }
    );
    user_referral.associate = function (models) {
        user_referral.belongsTo(models.user,{
            foreignKey: "userId",
        });

        user_referral.belongsTo(models.user,{
            foreignKey: "referralUserId",
        });
    };
    return user_referral;
};
