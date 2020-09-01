const express = require("express");
const app = express();
const errorHandler = require("./lib/middleware/error-handler");
const creditDecisionApp = require("./credit-decision/routes");

app.use("/decision", creditDecisionApp);

app.use(errorHandler());

module.exports = app;
