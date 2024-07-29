const mongoose = require("mongoose");

const otpschema = new mongoose.Schema({
  otp: { type: String, required: true },
  email: { type: String },
  createdAt: { type: Date, default: Date.now(), expires: 3000 },
});

const OTP = mongoose.model("otps", otpschema);

module.exports = OTP;
