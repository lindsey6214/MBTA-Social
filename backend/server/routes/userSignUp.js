const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { newUserValidation } = require("../models/userValidator");
const newUserModel = require("../models/userModel");

// Function to generate a random username
const generateRandomUsername = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let username = "User";
  for (let i = 0; i < 6; i++) {
    username += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return username;
};

router.post("/signup", async (req, res) => {
  try {
    // Validate user input
    const validationResult = newUserValidation(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.errors[0].message });
    }

    const { email, password, dateOfBirth } = req.body;

    // Ensure user is 13 or older
    const birthDate = new Date(dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 13) {
      return res.status(403).json({ message: "You must be at least 13 years old to create an account." });
    }

    // Check if email already exists
    const existingUser = await newUserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Generate a secure random username
    const username = generateRandomUsername();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new newUserModel({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
    });

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: "Account created successfully.", username });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;