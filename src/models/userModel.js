const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  termsAccepted: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
