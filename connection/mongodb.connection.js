const Mongoose = require('mongoose');
const { MongooseError } = require('mongoose');
const { Config } = require('../config/config');

const connectMongoDB = async () => {
  try{
    await Mongoose.connect(Config.DB_CONNECTION, {
      ssl: true,
    });
    console.log('database connected successfully');
  }catch(e){  
    console.error(e.message);
  }
}

module.exports = { connectMongoDB };