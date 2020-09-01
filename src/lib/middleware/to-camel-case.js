const toCamelCase = require("camelcase-keys");

module.exports = (req, res, next) => {
  req.body = toCamelCase(req.body);
  next();
};
