const { clearHash } = require("../services/cache");

module.exports = async function (req, res, next) {
  // means do next middleware and then come back here

  await next();

  clearHash(req.user.id);
};
