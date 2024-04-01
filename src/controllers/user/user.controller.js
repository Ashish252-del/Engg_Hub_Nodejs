const { Sequelize, Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");
const querystring = require("querystring");
const { TRANSACTION_TYPE } = require("../../helpers/constants");
const db = require("../../models");

const {
  successResponse,
  errorResponse,
  uniqueId,
  validateMobile,
  validateEmail,
  validateStrongPassword,
  getMD5Hased,
    make
} = require("../../helpers");
const { DEFAULT_TEST_OTP } = require("../../helpers/constants");
const sendEmail = require("../../utils/sendEmail");
const { uploadToS3, getUserPresignedUrls } = require("../../helpers/s3");

module.exports.register = async (req, res) => {
  try {
    let { mobile, email } = req.body;
    const searchQuery = [{ mobile }];
    if (email) {
      searchQuery.push({ email });
    }
    const userData = await user.findOne({
      where: { [Op.or]: searchQuery },
    });

    if (userData) {
      const existKey =
        userData.email === email
          ? "email"
          : userData.mobile == mobile
          ? "mobile"
          : "";

      return errorResponse(req, res, `User already exists with ${existKey}`);
    }
    const otp =
      process.env.NODE_ENV == "production"
        ? String(Math.random() * 1000000).slice(0, 6)
        : String(DEFAULT_TEST_OTP);

    const hashedOTP = crypto.createHash("md5").update(otp).digest("hex");
    const info = {
      otp: hashedOTP,
      expiresIn: Date.now() + 300000,
      mobile,
      isVerified: false
    };

    const userOtps = await user_otp.findAll({
      where: { mobile },
    });

    if (userOtps.length > 0) {
      await user_otp.destroy({
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { mobile: mobile },
          },
        ],
      });
    }
    await user_otp.create(info);

    return successResponse(req, res, {
      message: "OTP send successfully",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
module.exports.verifySignup = async (req, res) => {
  try {
    const { mobile, otp, email, password } = req.body;

    const userOtp = await user_otp.findOne({
      where: { mobile: mobile },
    });

    if (!userOtp) {
      return errorResponse(req, res, `No OTP found with this mobile`);
    }
    const { expiresIn } = userOtp;
    const hashedOtp = userOtp.otp;
    if (expiresIn < Date.now()) {
      await user_otp.destroy({
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { mobile: mobile },
          },
        ],
      });
      return errorResponse(req, res, "OTP has expired");
    }
    const reqOTP = crypto
      .createHash("md5")
      .update(otp || "")
      .digest("hex");

    if (reqOTP !== hashedOtp) {
      throw new Error("Invalid otp");
    }

    const reqPass = getMD5Hased(password);

    const payload = {
      mobile,
      password: reqPass,
      isVerified: true,
      isMobileVerified: true,
      verifyToken: uniqueId(),
      referralCode: uniqueId(6).toUpperCase()
    };
    if (email) {
      payload.email = email;
    }

    const parameters = `msisdn=${mobile}&name=${mobile}&password=${reqPass}${process.env.HELLO_PAY_SECRECT}`;

    const hashed = getMD5Hased(parameters);

    // const result = await axios.post(
    //   `${process.env.HELLO_PAY_BASE_URL}/api/register`,

    //   querystring.stringify({
    //     hash: hashed,
    //     msisdn: mobile,
    //     name: mobile,
    //     password: reqPass,
    //   }),
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }
    // );
    const newUser = await user.create(payload);
    const token = jwt.sign(
      {
        user: {
          userDataId: newUser.id,
          email: newUser.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET
    );
    await user_otp.destroy({
      where: {},
      include: [
        {
          model: user,
          as: user.userId,
          where: { mobile: mobile },
        },
      ],
    });
    console.log("==============newUser======================");
    console.log(newUser);
    console.log("====================================");
    newUser.username = "user" + newUser.id;
    return successResponse(req, res, { user: newUser, token });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
module.exports.login = async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const userData = await user.scope("withSecretColumns").findOne({
      where: { mobile: mobile },
      raw: true,
    });
    if (!userData) {
      throw new Error(`Please register or verify phone no`);
    }

    const reqPass = crypto
      .createHash("md5")
      .update(password || "")
      .digest("hex");

    if (reqPass.localeCompare(userData.password) !== 0) {
      throw new Error("Incorrect Mobile/Password");
    }
    const token = jwt.sign(
      {
        user: {
          userDataId: userData.id,
          email: userData.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET
    );
    delete userData.password;
    return successResponse(req, res, { user: userData, token });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.profile = async (req, res) => {
  try {
    const { userId } = req.user;

    const userData = await user.findOne({
      where: { id: userId },
      include: { model: transaction, as: transaction.userId },
    });
    return successResponse(req, res, { userData });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await user.findOne({
      where: { id: userId },
    });

    const reqPass = crypto
      .createHash("md5")
      .update(req.body.oldPassword)
      .digest("hex");
    if (reqPass !== user.password) {
      throw new Error("Old password is incorrect");
    }

    const newPass = crypto
      .createHash("md5")
      .update(req.body.newPassword)
      .digest("hex");

    await user.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.resendOTP = async (req, res) => {
  const { mobile } = req.params;
  try {
    const userData = await user_otp.findOne({
      where: { mobile: mobile },
    });
    if (!userData) {
      return errorResponse(req, res, `No user found with this moblle`);
    }

    const otp =
      process.env.NODE_ENV == "production"
        ? String(Math.random() * 1000000).slice(0, 6)
        : String(DEFAULT_TEST_OTP);

    const hashedOTP = crypto.createHash("md5").update(otp).digest("hex");

    const info = {
      otp: hashedOTP,
      expiresIn: Date.now() + 300000,
      isVerified: false,
      userId: userData.id,
    };

    const userOtps = await user_otp.findAll({
      where: { userId: userData.id },
    });

    if (userOtps.length > 0) {
      await user_otp.destroy({
        where: { userId: userData.id },
      });
    }
    await user_otp.create(info);
    return successResponse(req, res, { message: "OTP send successfully" });
    // res.status(200).json({
    //   status: true,
    //   message: "OTP send successfully",
    // });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.sendOTP = async (req, res) => {
  const { mobile } = req.params;
  try {
    const userData = await user.findOne({
      where: { mobile: mobile },
    });
    if (!userData) {
      return errorResponse(req, res, `No user found with this moblle`);
    }

    const otp =
      process.env.NODE_ENV == "production"
        ? String(Math.random() * 1000000).slice(0, 6)
        : String(DEFAULT_TEST_OTP);

    const hashedOTP = crypto.createHash("md5").update(otp).digest("hex");

    const info = {
      otp: hashedOTP,
      expiresIn: Date.now() + 300000,
      isVerified: false,
      userId: userData.id,
    };

    const userOtps = await user_otp.findAll({
      where: { userId: userData.id },
    });

    if (userOtps.length > 0) {
      await user_otp.destroy({
        where: { userId: userData.id },
      });
    }
    await user_otp.create(info);
    return successResponse(req, res, { message: "OTP send successfully" });
    // res.status(200).json({
    //   status: true,
    //   message: "OTP send successfully",
    // });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
module.exports.verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const userOtp = await user_otp.findOne({
      include: [
        {
          model: user,
          as: user.userId,
          where: { mobile: mobile },
        },
      ],
    });
    if (!userOtp) {
      return errorResponse(req, res, `No OTP found with this mobile`);
    }
    const { expiresIn } = userOtp;
    const hashedOtp = userOtp.otp;
    if (expiresIn < Date.now()) {
      await user_otp.destroy({
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { mobile: mobile },
          },
        ],
      });

      return errorResponse(req, res, "OTP has expired");
    }
    const reqOTP = crypto
      .createHash("md5")
      .update(otp || "")
      .digest("hex");

    if (reqOTP !== hashedOtp) {
      throw new Error("Invalid otp");
    }

    await user_otp.update(
      { isVerified: true },
      {
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { mobile: mobile },
          },
        ],
      }
    );
    return successResponse(req, res, { message: "OTP verified successfully" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.sendEmailOTP = async (req, res) => {
  const { email } = req.params;
  try {
    const userData = await user.findOne({
      where: { email: email },
    });
    if (!userData) {
      return errorResponse(req, res, `No user found with this email`);
    }

    const otp = String(Math.random() * 1000000).slice(0, 6);

    const hashedOTP = crypto.createHash("md5").update(otp).digest("hex");

    const info = {
      otp: hashedOTP,
      expiresIn: Date.now() + 300000,
      isVerified: false,
      userId: userData.id,
    };

    const userOtps = await user_otp.findAll({
      where: { userId: userData.id },
    });

    if (userOtps.length > 0) {
      await user_otp.destroy({
        where: { userId: userData.id },
      });
    }
    await user_otp.create(info);
    const body = `OTP : ${otp}`;

    await sendEmail(userData.email, "forgot-password", body);
    return successResponse(req, res, { message: "OTP send successfully" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userOtp = await user_otp.findOne({
      include: [
        {
          model: user,
          as: user.userId,
          where: { email: email },
        },
      ],
    });

    if (!userOtp) {
      return errorResponse(req, res, `No OTP found with this email`);
    }
    const { expiresIn } = userOtp;
    const hashedOtp = userOtp.otp;
    if (expiresIn < Date.now()) {
      await user_otp.destroy({
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { email: email },
          },
        ],
      });

      return errorResponse(req, res, "OTP has expired");
    }
    const reqOTP = crypto
      .createHash("md5")
      .update(otp || "")
      .digest("hex");

    if (reqOTP !== hashedOtp) {
      throw new Error("Invalid otp");
    }

    await user_otp.update(
      { isVerified: true },
      {
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { email: email },
          },
        ],
      }
    );
    await user.update(
      { isEmailVerified: true },
      {
        where: { email: email },
      }
    );
    return successResponse(req, res, { message: "OTP verified successfully" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { mobile, newPassword } = req.body;
    const userOtp = await user_otp.findOne({
      include: [
        {
          model: user,
          as: user.userId,
          where: { mobile: mobile },
        },
      ],
    });
    if (!userOtp || !userOtp.isVerified) {
      return errorResponse(req, res, `Please verify OTP`);
    }
    const userData = await user.findOne({
      where: { mobile: mobile },
    });
    if (!userData) {
      return errorResponse(req, res, "User not found");
    }

    const newPass = crypto.createHash("md5").update(newPassword).digest("hex");

    await user.update({ password: newPass }, { where: { id: userData.id } });
    await user_otp.destroy({
      where: {},
      include: [
        {
          model: user,
          as: user.userId,
          where: { mobile: mobile },
        },
      ],
    });
    return successResponse(req, res, {
      message: "Password changed successfully",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.checkUserExist = async (req, res) => {
  try {
    const { mobile } = req.params;
    const userData = await user.findOne({
      where: { mobile: mobile },
    });

    if (userData) {
      return errorResponse(req, res, "User exist");
    }

    return successResponse(req, res, { message: "User available" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.sendEmailOTPUpdateEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const otp = String(Math.random() * 1000000).slice(0, 6);

    const hashedOTP = crypto.createHash("md5").update(otp).digest("hex");

    const info = {
      otp: hashedOTP,
      expiresIn: Date.now() + 300000,
      isVerified: false,
      userId: req.user.id,
    };

    const userOtps = await user_otp.findAll({
      where: { userId: req.user.id },
    });

    if (userOtps.length > 0) {
      await user_otp.destroy({
        where: { userId: req.user.id },
      });
    }
    await user_otp.create(info);
    const body = `OTP : ${otp}`;

    await sendEmail(email, "update-email", body);
    return successResponse(req, res, { message: "OTP send successfully" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.verifyEmailOTPUpdateEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userOtp = await user_otp.findOne({
      include: [
        {
          model: user,
          as: user.userId,
          where: { id: req.user.id },
        },
      ],
    });

    if (!userOtp) {
      return errorResponse(req, res, `No OTP found with this email`);
    }
    const { expiresIn } = userOtp;
    const hashedOtp = userOtp.otp;
    if (expiresIn < Date.now()) {
      await user_otp.destroy({
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { email: email },
          },
        ],
      });

      return errorResponse(req, res, "OTP has expired");
    }
    const reqOTP = crypto
      .createHash("md5")
      .update(otp || "")
      .digest("hex");

    if (reqOTP !== hashedOtp) {
      throw new Error("Invalid otp");
    }

    await user_otp.update(
      { isVerified: true },
      {
        where: {},
        include: [
          {
            model: user,
            as: user.userId,
            where: { email: email },
          },
        ],
      }
    );
    await user.update(
      { isEmailVerified: true },
      {
        where: { email: email },
      }
    );
    return successResponse(req, res, { message: "OTP verified successfully" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.mobile) {
      return errorResponse(req, res, "You can not update mobile");
    }
    if (req.body.email) {
      const userOtp = await user_otp.findOne({
        include: [
          {
            model: user,
            as: user.userId,
            where: { id: req.user.id },
          },
        ],
      });

      if (!userOtp || !userOtp.isVerified) {
        return errorResponse(req, res, `Please verify OTP`);
      }
    }
    await user.update(req.body, { where: { id: id } });
    if (req.body.email) {
      await user.update({ isEmailVerified: true }, { where: { id: id } });
    }
    await user_otp.destroy({
      where: {},
      include: [
        {
          model: user,
          as: user.userId,
          where: { email: req.body.email },
        },
      ],
    });
    return successResponse(req, res, { message: "User updated successfully" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.profilePictureUpload = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return errorResponse(req, res, "file is required");
    }

    const results = await uploadToS3(file, req.user.userId);

    return successResponse(req, res, results);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
module.exports.getProfilePicture = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return errorResponse(req, res, "key is required");
    }

    const presignedUrls = await getUserPresignedUrls(key);

    return successResponse(req, res, { url: presignedUrls });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.userReferral = async (req, res) => {
  try{
    const { user_id,referral_code } = req.body;

    if (!referral_code) {
      return errorResponse(req, res, "Referral Code is required");
    }
    const getBonus = await bonus_setting.findOne();
    let userBonus = 0, referUserBonus = 0;
    if(getBonus){
      userBonus = getBonus.userBonus;
      referUserBonus = getBonus.referralUserBonus;
    }
    const userDetail = await user.findOne({
      where: { referralCode: referral_code },
    });
    if(!userDetail){
      return errorResponse(req, res, "User not found");
    }
    const checkReferral = await user_referral.findOne({
      where: { userId: user_id, referralUserId: userDetail.id},
    });
    console.log(checkReferral,"sasas");
    if(checkReferral!=null){
      return errorResponse(req, res, "Already used");
    }
    /***User Bonus ***/
    const info = {
      userId: user_id,
      referralUserId: userDetail.id,
      userBonus: userBonus,
      referralUserBonus: referUserBonus,
    };
    await user_referral.create(info);

    const getUserWallet = await user_wallet.findOne({
      where: { userId: user_id},
    })

    if(!getUserWallet){
      const walletInfo = {
        userId: user_id,
        bonusBalance: userBonus
      }
      await user_wallet.create(walletInfo);
    }else{
      const bonus = +(getUserWallet.bonusBalance) + userBonus;
      await user_wallet.update({ bonusBalance: bonus }, { where: { id: user_id } });
    }
    const transactionInfo = {
      transactionId: Math.floor(Math.random() * 1000000000),
      currency: 'INR',
      cash: 0,
      bonus: userBonus,
      reference: 'Referral',
      userId: user_id,
      type: TRANSACTION_TYPE.DEPOSIT,
    };

    await transaction.create(transactionInfo);


    /***Referral User Bonus ***/
    const getReferralUserWallet = await user_wallet.findOne({
      where: { userId: userDetail.id},
    })

    if(!getReferralUserWallet){
      const walletInfos = {
        userId: userDetail.id,
        bonusBalance: referUserBonus
      }
      await user_wallet.create(walletInfos);
    }else{
      const bonus = +(getReferralUserWallet.bonusBalance) + referUserBonus;
      await user_wallet.update({ bonusBalance: bonus }, { where: { id: userDetail.id } });
    }
    const transactionInfos = {
      transactionId: Math.floor(Math.random() * 1000000000),
      currency: 'INR',
      cash: 0,
      bonus: referUserBonus,
      reference: 'Referral',
      userId: userDetail.id,
      type: TRANSACTION_TYPE.DEPOSIT,
    };

    await transaction.create(transactionInfos);
    return successResponse(req, res, { message: "Referral Done" });
  }catch (error) {
    return errorResponse(req, res, error.message);
  }
}

module.exports.verifyFbToken = async (req, res) => {
  const { facebook_id, access_token, mobile } = req.body;
  // console.log(`https://graph.facebook.com/${facebook_id}?fields=id,name,email,picture&access_token=${access_token}`);
  try {
    const checkuser = await user.findOne({where:{ facebookUserId: facebook_id }});
    if (checkuser) {
      return errorResponse(req, res, "User already registered. Please login.");
      //res.status(422).json({ message: "User already registered. Please login." });
    }


    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${facebook_id}?fields=id,name,email,picture&access_token=${access_token}`,
      headers: { }
    };

    axios.request(config)
        .then((response) => {
          const newUser =  {
            facebookUserId: response.data.id,
            name: response.data.name,
            email: response.data.email,
            mobile: mobile,
            profilePic: response.data.picture.data.url
          };

         user.create(newUser);
          console.log(newUser);
          return successResponse(req, res, { message: "User registered successfully with facebook." });
        })
        .catch((error) => {
          console.log(error);
          return errorResponse(req, res, error.message);
        });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
module.exports.userInfo = async (req,res)=>{
  try {
    const info = await game_history.findAll({
      where:{userId:req.params.userId},
      attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('tableId')), 'gamePlayed'],
          [Sequelize.fn('SUM', Sequelize.col('winAmount')), 'WinningAmount'],
      ],
      group: ['userId']
  })
  const wins = await game_history.count({
    where:{
      userId:req.params.userId,
      isWin:1
    }
  })
  const lost = await game_history.count({
    where:{
      userId:req.params.userId,
      isWin:0
    }
  })
  let result = {
    info, wins, lost
  }
  return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req,res,error.message)
  }
}

module.exports.loginClient = async (req, res) => {
  try {
    const userData = await db.user.scope("withSecretColumns").findOne({
      where: { uuid: req.body.uuid },
    });
    if (!userData) {
      throw new Error("Incorrect Username/Password");
    }

    const reqPass = crypto
      .createHash("md5")
      .update(req.body.password || "")
      .digest("hex");

    console.log("===============localeCompare=====================");
    console.log(userData);
    console.log("====================================");

    if (reqPass.localeCompare(userData.password) !== 0) {
      throw new Error("Incorrect Username/Password");
    }

    const token = jwt.sign(
      {
        user: {
          userId: userData.id,
          email: userData.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET
    );
    delete userData.dataValues.password;
    return successResponse(req, res, { user: userData, token });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};