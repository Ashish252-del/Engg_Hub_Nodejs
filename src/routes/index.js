const express = require("express");
const publicRoutes = require("./public");
const publicAdminRoutes = require("./public_admin");
const userRoutes = require("./user");
const walletRoutes = require("./wallet");
const adminRoutes = require("./admin");
const apiMiddleware = require("../middleware/apiAuth");
const adminMiddleware = require("../middleware/adminAuth");

const Router = express.Router();

Router.use("/api", publicRoutes);
Router.use("/api/admin", publicAdminRoutes);
Router.use("/api/admin",apiMiddleware,adminMiddleware, adminRoutes);
Router.use("/api/user", apiMiddleware, userRoutes);
Router.use("/api/wallet", apiMiddleware, walletRoutes);

module.exports = Router;
