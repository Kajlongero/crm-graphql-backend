require('dotenv').config();

const Config = {
  DB_CONNECTION: process.env.MONGO_DB_CONNECTION,
  JWT_SECRET: process.env.TOKEN_SECRET_PASSPHRASE,
}

module.exports = { Config };