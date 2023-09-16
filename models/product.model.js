const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  createdAt: {
    type: String,
  }
});

ProductSchema.index({ name: 'text' });

const ProductModel = Mongoose.model('products', ProductSchema);

module.exports = { ProductModel };
