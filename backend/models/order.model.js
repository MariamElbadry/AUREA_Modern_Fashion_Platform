const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: Number,
  name:      String,
  price:     Number,
  imageUrl:  String,
  quantity:  Number,
  designer:  String
});

const orderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status:      { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);