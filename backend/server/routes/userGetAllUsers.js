const express = require("express");
const router = express.Router();
const newUserModel = require("../models/userModel");

// Middleware to check for the access code
const checkAccessCode = (req, res, next) => {
  const accessCode = req.headers['access-code'];

  if (accessCode !== 'BlueLineIsTheBestLine12345') {
    return res.status(403).json({ message: "Access denied. Invalid access code." });
  }

  next();
};

// Route to get all users (any authenticated user, but access code required)
router.get("/getAll", checkAccessCode, async (req, res) => {
  try {
    // Fetch all users, excluding their password field
    const users = await newUserModel.find().select("-password");
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;