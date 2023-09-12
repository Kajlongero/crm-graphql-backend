require('dotenv').config();

const Config = {
  DB_CONNECTION: process.env.MONGO_DB_CONNECTION,
}

module.exports = { Config };