const jwt = require('jsonwebtoken');
const { Config } = require('../config/config');

const signToken = (data, exp) => {

  const { id, role } = data;

  const payload = {
    sub: id,
    role: role ?? 'seller',
    iat: Date.now(),
  }

  return jwt.sign(payload, Config.JWT_SECRET, { expiresIn: exp ?? '3d' });
}

module.exports = signToken;