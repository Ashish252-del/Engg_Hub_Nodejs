const { default: axios } = require("axios");
const {
  successResponse,
  errorResponse,
  getMD5Hased,
} = require("../../helpers");
const { user, transaction } = require("../../models");
const querystring = require("querystring");
const { TRANSACTION_TYPE } = require("../../helpers/constants");
const { v4: uuidv4 } = require("uuid");

module.exports.getWallet = async (req, res) => {
  try {
    const userData = await user.findOne({
      where: { id: req.user.id },
    });

    const parameters = `msisdn=${userData.mobile}${process.env.HELLO_PAY_SECRECT}`;
    const hashed = getMD5Hased(parameters);

    const result = await axios.post(
      `${process.env.HELLO_PAY_BASE_URL}/api/wallet`,
      querystring.stringify({
        msisdn: userData.mobile,
        hash: hashed,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return successResponse(req, res, result.data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.placeBet = async (req, res) => {
  const { amount } = req.body;
  const reference = uuidv4();
  const timestamp = Date.now();
  try {
    const userData = await user.findOne({
      where: { id: req.user.id },
    });

    const parameters = `amount=${amount}&msisdn=${userData.mobile}&reference=${reference}&timestamp=${timestamp}${process.env.HELLO_PAY_SECRECT}`;
    const hashed = getMD5Hased(parameters);

    const result = await axios.post(
      `${process.env.HELLO_PAY_BASE_URL}/api/bet`,
      querystring.stringify({
        msisdn: userData.mobile,
        hash: hashed,
        amount,
        reference,
        timestamp,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const info = {
      transactionId: result.data.transactionId,
      currency: result.data.currency,
      cash: result.data.cash,
      bonus: result.data.bonus,
      reference: reference,
      userId: req.user.id,
      type: TRANSACTION_TYPE.BET,
    };

    await transaction.create(info);
    result.data.reference = reference;
    return successResponse(req, res, result.data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.payout = async (req, res) => {
  const { amount } = req.body;
  const reference = uuidv4();
  const timestamp = Date.now();
  try {
    const userData = await user.findOne({
      where: { id: req.user.id },
    });

    const parameters = `amount=${amount}&msisdn=${userData.mobile}&reference=${reference}&timestamp=${timestamp}${process.env.HELLO_PAY_SECRECT}`;
    const hashed = getMD5Hased(parameters);

    const result = await axios.post(
      `${process.env.HELLO_PAY_BASE_URL}/api/payout`,
      querystring.stringify({
        msisdn: userData.mobile,
        hash: hashed,
        amount,
        reference,
        timestamp,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const info = {
      transactionId: result.data.transactionId,
      currency: result.data.currency,
      cash: result.data.cash,
      bonus: result.data.bonus,
      reference: reference,
      userId: req.user.id,
      type: TRANSACTION_TYPE.DEPOSIT,
    };

    await transaction.create(info);
    result.data.reference = reference;

    return successResponse(req, res, result.data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.refund = async (req, res) => {
  const { reference } = req.body;
  const timestamp = Date.now();
  try {
    const userData = await user.findOne({
      where: { id: req.user.id },
    });

    const parameters = `msisdn=${userData.mobile}&reference=${reference}&timestamp=${timestamp}${process.env.HELLO_PAY_SECRECT}`;
    const hashed = getMD5Hased(parameters);

    const result = await axios.post(
      `${process.env.HELLO_PAY_BASE_URL}/api/refund`,
      querystring.stringify({
        msisdn: userData.mobile,
        hash: hashed,
        reference,
        timestamp,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const info = {
      transactionId: result.data.transactionId,
      currency: result.data.currency,
      cash: result.data.cash,
      bonus: result.data.bonus,
      reference: reference,
      userId: req.user.id,
      type: TRANSACTION_TYPE.REFUND,
    };

    await transaction.create(info);
    return successResponse(req, res, result.data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports.allTransactions = async (req, res) => {
  try {
    const walletData = await transaction.findAll({});

    return successResponse(req, res, walletData);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
