const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    strim: true,
  },
  lastName: {
    type: String,
    required: true,
    strim: true,
  },
  email: {
    type: String,
    required: true,
    strim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    strim: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

const UserModel = Mongoose.model('users', UserSchema);

module.exports = { UserModel };
