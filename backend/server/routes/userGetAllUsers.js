const express = require("express");
const router = express.Router();
const newUserModel = require("../models/userModel");

// Route to get all users (no access code required)
router.get("/getAll", async (req, res) => {
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