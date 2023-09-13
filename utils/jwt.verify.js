const jwt = require('jsonwebtoken');
const { Config } = require("../config/config");

const verifyToken = (token) => {
  const verify = jwt.verify(token, Config.JWT_SECRET);
  if(!verify) throw new Error('token invalid');

  return verify;
}

module.exports = verifyToken;