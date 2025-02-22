const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      name: { type: String, required: true},
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: String, required: true },
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  paymentMethod: { 
    type: String, 
    enum: ["Card", "Cash on Delivery"], 
    required: true 
  },
  cardDetails: {
    cardNumber: { type: String },
    expiry: { type: String },
    cvv: { type: String },
  },
  orderStatus: { 
    type: String, 
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
