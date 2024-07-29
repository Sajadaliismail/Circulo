const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthMonth: { type: Number },
  birthYear: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  profilePicture: { type: String },
  bio: { type: String },
  lastLogin: { type: Date },
  updatedAt: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: Date.now },
  isSetupComplete: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
