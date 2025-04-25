const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const newUserModel = require("../models/userModel");
const { generateAccessToken } = require("../utilities/generateToken");

router.post("/editUser", async (req, res) => {
  try {
    const { userId, password, username, email } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "User ID and new password are required." });
    }

    // Fetch user from database
    const user = await newUserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent username and email modification
    if ((username && username !== user.username) || (email && email !== user.email)) {
      return res.status(403).json({ message: "Username and email cannot be modified." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Update password only
    const updatedUser = await newUserModel.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user." });
    }

    // Generate new access token
    const accessToken = generateAccessToken(updatedUser._id, updatedUser.email);

    res.header("Authorization", accessToken).json({ accessToken });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;