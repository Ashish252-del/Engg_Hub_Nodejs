const express = require("express");
const dotenv = require("dotenv");

const bodyParser = require("body-parser");
const cors = require("cors");
require("./src/cron")
const indexRoute = require("./src/routes")
const errorHandler = require("./src/middleware/errorHandler");
dotenv.config();
require("./src/config/sequelize");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(indexRoute)
app.use(errorHandler);
module.exports = app;
