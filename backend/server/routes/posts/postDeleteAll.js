const express = require("express");
const router = express.Router();
const postModel = require("../../models/postModel");

// Middleware for authentication (example, replace with actual auth logic)
const authenticateAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Route to delete all users (admin-only)
router.get("/deleteAll", authenticateAdmin, async (req, res) => {
  try {
    const result = await postModel.deleteMany();
    return res.json({ message: "All posts deleted successfully.", result });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting posts.", error });
  }
});

module.exports = router;