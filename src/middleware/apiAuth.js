const { errorResponse } = require("../helpers");
const { user } = require("../models");

const jwt = require("jsonwebtoken");

const apiAuth = async (req, res, next) => {
  if (!(req.headers && req.headers["token"])) {
    return errorResponse(req, res, "Token is not provided", 401);
  }
  const token = req.headers["token"];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;

    const userData = await user.scope("withSecretColumns").findOne({
      where: { id: req.user.userId || req.user.userDataId },
      raw: true,
    });
    if (!userData) {
      return errorResponse(req, res, "User is not found in system", 401);
    }
    const reqUser = { ...userData };
    reqUser.userId = userData.id;
    req.user = reqUser;
    return next();
  } catch (error) {
    console.log("error is ", error);
    return errorResponse(
      req,
      res,
      "Incorrect token is provided, try re-login",
      401
    );
  }
};

module.exports = apiAuth;
