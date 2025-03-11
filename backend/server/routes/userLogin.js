const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { userLoginValidation } = require("../models/userValidator");
const newUserModel = require("../models/userModel");
const { generateAccessToken } = require("../utilities/generateToken");

router.post("/login", async (req, res) => {
  try {
    // Validate user input
    const validationResult = userLoginValidation(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.errors[0].message });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await newUserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT without storing the password in the token
    const accessToken = generateAccessToken(user._id, user.email, user.username);

    // Send token in response header
    res.header("Authorization", accessToken).json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;