const express = require("express");
const { validate } = require("express-validation");

const userWallet = require("../controllers/wallet/wallet.controller");
const walletValidator = require("../controllers/wallet/wallet.validator");

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get("/testone", (req, res) => {
  res.send("ok");
});
router.get("/", userWallet.getWallet);
router.post("/bet", validate(walletValidator.placeBet), userWallet.placeBet);
router.post("/payout", validate(walletValidator.payout), userWallet.payout);
router.post("/refund", validate(walletValidator.refund), userWallet.refund);
router.get("/transactions", userWallet.allTransactions);

module.exports = router;
