const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  termsAccepted: { type: Boolean, required: true },
  location: {
    originCountry: { type: String },
    currentLocation: { type: String },
  },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  otpExpires: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
