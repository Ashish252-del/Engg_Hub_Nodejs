const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { user ,user_otp} = require("../../models");
const db = require("../../models")
const sendEmail = require("../../utils/sendEmail");
const { successResponse, errorResponse, uniqueId } = require("../../helpers");

module.exports.allUsers = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 10;
    const users = await user.findAndCountAll({
      attributes:['id','name','kyc','mobile','email',['username','User_Name'],['isMobileVerified','Is_Mobile_Verified'],['isEmailVerified','Is_Email_Verified'],['isVerified','Is_Verified'],['referralCode','Referral_Code'],['facebookUserId','Facebook_User_Id'],['createdAt','Created_At'],['updatedAt','Updated_At']],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { users });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// module.exports.mostWinsUsers = async (req, res) => {
//   try {
//     const users = await user.findAll({
//       attributes: ["name", "email"],
//       include: {
//         model: wallet,
//         order: [["wins", "ASC"]],
//       },
//     });
//     return successResponse(req, res, { data: users });
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };
// module.exports.dashboard = async (req, res) => {
//   try {
//     const data = await wallet.findAll({
//       attributes: ["setAmount", "withdrawable"],
//     });
//     return successResponse(req, res, { data });
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };

module.exports.UserWithKyc = async (req, res) => {
  try {
    const userData = await user.findAll({
      where: {
        kyc: "Yes",
      },
    });
    return successResponse(req, res, { user: userData });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.register = async (req, res) => {
  try {
    const { firstname, lastname, mobile, email, password } = req.body;

    if (process.env.IS_GOOGLE_AUTH_ENABLE === "true") {
      if (!req.body.code) {
        throw new Error("code must be defined");
      }
      const { code } = req.body;
      const customUrl = `${process.env.GOOGLE_CAPTCHA_URL}?secret=${process.env.GOOGLE_CAPTCHA_SECRET_SERVER}&response=${code}`;
      const response = await axios({
        method: "post",
        url: customUrl,
        data: {
          secret: process.env.GOOGLE_CAPTCHA_SECRET_SERVER,
          response: code,
        },
        config: { headers: { "Content-Type": "multipart/form-data" } },
      });
      if (!(response && response.data && response.data.success === true)) {
        throw new Error("Google captcha is not valid");
      }
    }
   console.log("db.user is ----->", db.user );
    const userData = await db.user.findOne({
      where: {
        [Op.or]: [{ email: email },  { mobile: mobile }],
      },
    });
    if (userData) {
      const existKey =
        userData.email === email
          ? "email"
          : userData.mobile === mobile
          ? "mobile"
          : userData.username
          ? "username"
          : "";
      throw new Error(`User already exists with ${existKey}`);
    }
    const reqPass = crypto.createHash("md5").update(password).digest("hex");
    const otp = "111111";
    const payload = {
      mobile,
      email,
      firstname,
      lastname,
      password: reqPass,
      isVerified: false,
      verifyToken: uniqueId(),
      phoneOTP: otp,
      isAdmin: true,
    };

    await db.user.create(payload);
    return successResponse(req, res, {
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("error is ", error);
    return errorResponse(req, res, error.message);
  }
};

module.exports.login = async (req, res) => {
  try {
    const userData = await db.user.scope("withSecretColumns").findOne({
      where: { email: req.body.email },
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

module.exports.verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await user.findOne({
      where: { mobile: mobile },
    });

    if (user.phoneOTP !== otp) {
      return errorResponse(req, res, "Invalid OTP");
    }

    await user.update(
      { phoneOTP: "", isMobileVerified: true },
      { where: { id: user.id } }
    );
    return successResponse(req, res, {
      message: "OTP verified successfully",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.checkUserExist = async (req, res) => {
  try {
    const { mobile } = req.params;

    const user = await user.findOne({
      where: { mobile: mobile },
    });

    if (user) {
      return errorResponse(req, res, { message: "User exist" });
    }

    return successResponse(req, res, { message: "User available" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.sendEmailOTP = async (req, res) => {
  const { email } = req.params;
  try {
    const userData = await user.findOne({
      where: { email: email,
               isAdmin:true },
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
    const { username, newPassword } = req.body;
    const userOtp = await user_otp.findOne({
      include: [
        {
          model: user,
          as: user.userId,
          where: { username: username },
        },
      ],
    });
    if(!userOtp) {
      return errorResponse(req, res, `Incorrect Username `);
    }
    if (!userOtp.isVerified) {
      return errorResponse(req, res, `Please verify OTP`);
    }
    const userData = await user.findOne({
      where: { username: username },
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
          where: { username: username },
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

module.exports.createClient = async (req, res) => {
  try {
    const { firstname,lastname , mobile, email, roleCode , jsonData} = req.body;

    const userData = await db.user.findOne({
      where: {
        [Op.or]: [{ email: email },  { mobile: mobile }],
      },
    });
    if (userData) {
      const existKey =
        userData.email === email
          ? "email"
          : userData.mobile === mobile
          ? "mobile"
          : "";
      throw new Error(`User already exists with ${existKey}`);
    }
    let password = uniqueId();
    const reqPass = crypto.createHash("md5").update(password).digest("hex");
    const payload = {
      mobile,
      email,
      firstname,
      password: reqPass,
      lastname,
      uuid: ""+uniqueId(),
      jsonData,
      roleCode
    };
    await db.user.create(payload);
    return successResponse(req, res, {
      message: "User registered successfully",
      uuid:payload.uuid,
      password:password
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

