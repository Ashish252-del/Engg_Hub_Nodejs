const express = require("express");
const { validate } = require("express-validation");

const userController = require("../controllers/user/user.controller");
const userValidator = require("../controllers/user/user.validator");

const router = express.Router();
const multer = require("multer");
const { memoryStorage } = require("multer");

const storage = memoryStorage();
const upload = multer({ storage });

//= ===============================
// API routes
//= ===============================
router.get("/testone", (req, res) => {
  res.send("ok");
});
router.get("/profile", userController.profile);
router.post(
  "/changePassword",
  validate(userValidator.changePassword),
  userController.changePassword
);
router.put(
  "/:id",
  validate(userValidator.updateUser),
  userController.updateUser
);
router.get(
  "/send-otp/:email",
  validate(userValidator.sendEmailOTP),
  userController.sendEmailOTPUpdateEmail
);
router.post(
  "/verify-otp",
  validate(userValidator.verifyEmailOTP),
  userController.verifyEmailOTPUpdateEmail
);
router.post(
  "/profile-picture",
  upload.single("image"),
  userController.profilePictureUpload
);
router.get(
  "/profile-picture",

  userController.getProfilePicture
);

router.post(
    "/user-referral",
    userController.userReferral
);
router.get('/game/info/:userId', userController.userInfo);


module.exports = router;
