const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Ensures a valid email format
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Keep length validation, but no regex here
    maxlength: 128,
  },
  username: {
    type: String,
    unique: true,
    immutable: true,
    default: function () {
      return "User" + crypto.randomInt(1000, 9999);
    },
  },
  birthdate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        let age = today.getFullYear() - value.getFullYear();
        const monthDiff = today.getMonth() - value.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) {
          age--; 
        }
        return age >= 13;
      },
      message: "Users must be at least 13 years old to sign up.",
    },
  },
  followingUsers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  followingLines: [{type: mongoose.Schema.Types.ObjectId, ref: "TrainLine"}],
  followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;