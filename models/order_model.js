const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: String, required: true },
       name: {
      type: String,
      required: true
    },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
  type: String,
  enum: ["pending", "preparing", "ready", "delivered", "canceled"],
  default: "pending"
}
});

module.exports = mongoose.model('Order', orderSchema);