//userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["Admin", "User", "Manager"], default: "User" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
