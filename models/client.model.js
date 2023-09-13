const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ClientSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  seller: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  }
});

const ClientModel = Mongoose.model('clients', ClientSchema);

module.exports = { ClientModel };