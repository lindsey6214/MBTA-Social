const express = require("express");
const router = express.Router();
const newUserModel = require("../models/userModel");

// Middleware for authentication (Example: Replace with actual auth logic)
const authenticateUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }
  next();
};

// Route to get a user by ID
router.get("/getUserById/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the requesting user is accessing their own data (or is an admin)
    if (req.user._id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Find user and exclude password
    const user = await newUserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User ID does not exist." });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;