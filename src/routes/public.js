const express = require("express");
// const validate = require("express-validation");
const { validate } = require("express-validation");
const userController = require("../controllers/user/user.controller");
const userValidator = require("../controllers/user/user.validator");

const router = express.Router();

//= ===============================
// Public routes
//= ===============================
router.get("/test", (req, res) => {
  res.send("ok");
});

router.post("/login", validate(userValidator.login), userController.login);
router.get(
  "/send-otp/:mobile",
  validate(userValidator.sendOTP),
  userController.sendOTP
);
router.get(
  "/send-otp/email/:email",
  validate(userValidator.sendEmailOTP),
  userController.sendEmailOTP
);
router.post(
  "/verify-signup",
  validate(userValidator.verifySignup),
  userController.verifySignup
);
router.post(
  "/verify-otp",
  validate(userValidator.verifyOTP),
  userController.verifyOTP
);
router.post(
  "/verify-otp/email",
  validate(userValidator.verifyEmailOTP),
  userController.verifyEmailOTP
);
router.put(
  "/forgot-password",
  validate(userValidator.forgotPassword),
  userController.forgotPassword
);
router.get(
  "/user/exist/:mobile",
  validate(userValidator.checkUserExists),

  userController.checkUserExist
);
router.post(
  "/signup",
  validate(userValidator.register),
  userController.register
);

router.post(
  "/verify-fb-token",
  userController.verifyFbToken
);

router.get('/resendOtp/:mobile',userController.resendOTP);
module.exports = router;
