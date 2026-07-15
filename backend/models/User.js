const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true } // stored as bcrypt hash
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
