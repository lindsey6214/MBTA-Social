const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const newUserModel = require("../models/userModel");
const { newUserValidation } = require("../models/userValidator");
const { generateAccessToken } = require("../utilities/generateToken");

router.post("/editUser", async (req, res) => {
  try {
    // Validate user input
    const validationResult = newUserValidation(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.errors[0].message });
    }

    const { userId, email, password } = req.body;

    // Check if user exists
    const user = await newUserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent username modification
    if (req.body.username && req.body.username !== user.username) {
      return res.status(403).json({ message: "Username cannot be modified." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Update user details
    const updatedUser = await newUserModel.findByIdAndUpdate(
      userId,
      { email, password: hashPassword },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user." });
    }

    // Generate new access token
    const accessToken = generateAccessToken(updatedUser._id, updatedUser.email);

    // Send response with new token
    res.header("Authorization", accessToken).json({ accessToken });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;