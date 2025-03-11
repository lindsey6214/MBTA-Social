const express = require("express");
const router = express.Router();
const newUserModel = require("../models/userModel");

// Middleware for authentication (Example: Replace with actual auth logic)
const authenticateAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Route to get all users (admin-only)
router.get("/getAll", authenticateAdmin, async (req, res) => {
  try {
    const users = await newUserModel.find().select("-password"); // Exclude passwords
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;