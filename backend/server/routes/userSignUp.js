const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { newUserValidation } = require("../models/userValidator");
const newUserModel = require("../models/userModel");

// More secure username generator with uniqueness check
const generateRandomUsername = async () => {
  let username;
  let userExists = true;
  while (userExists) {
    username = `User${Math.random().toString(36).substring(2, 8)}`;
    const existingUser = await newUserModel.findOne({ username });
    if (!existingUser) {
      userExists = false;
    }
  }
  return username;
};

router.post("/signup", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line

    // Validate user input
    const validationResult = newUserValidation(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.errors[0].message });
    }

    const { email, password, birthdate } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Ensure birthdate is provided
    if (!birthdate || isNaN(new Date(birthdate))) {
      return res.status(400).json({ message: "A valid birthdate is required." });
    }

    // Ensure user is 13 or older
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust age if birthday hasn't occurred yet this year
    }
    if (age < 13) {
      return res.status(403).json({ message: "You must be at least 13 years old to create an account." });
    }

    // Check if email already exists
    const existingUser = await newUserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Validate password BEFORE hashing
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Generate a secure random username
    const username = await generateRandomUsername();

    // Hash the password AFTER validation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new newUserModel({
      username,
      email,
      password: hashedPassword,
      birthdate,
    });

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: "Account created successfully.", username });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
});

module.exports = router;