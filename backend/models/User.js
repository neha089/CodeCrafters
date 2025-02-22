const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Additional user details can be added here (e.g., profile image, address, etc.)
});

module.exports = mongoose.model("User", userSchema);
