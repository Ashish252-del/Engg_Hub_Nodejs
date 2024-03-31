const express = require("express");
const { validate } = require("express-validation");
const userController = require("../controllers/user/admin.user.controller");
const userValidator = require("../controllers/user/user.validator");
const adminValidator = require("../controllers/user/admin.validator");
const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get("/user/all/:page", userController.allUsers);
router.get("/user/verified", userController.UserWithKyc);
// router.get("/user/top", userController.mostWinsUsers);
// router.get("/dashboard", userController.dashboard);





module.exports = router;
