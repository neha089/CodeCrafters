const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  img: { type: String, required: true },
  category: { type: String, required: true }
});
module.exports = mongoose.model("Product", productSchema);

