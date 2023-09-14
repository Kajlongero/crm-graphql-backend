const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const OrderSchema = new Schema({
  order: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'PENDING',
  },
  client: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'clients',
  },
  seller: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  }
})

const OrderModel = Mongoose.model('orders', OrderSchema);

module.exports = { OrderModel }