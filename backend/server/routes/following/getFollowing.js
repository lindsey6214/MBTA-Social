const express = require("express");
const User = require("../models/User");
const TrainLine = require("../models/TrainLine");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/following", authenticate, async (req, res) => {
    try {
      const currentUser = await User.findById(req.user._id)
        .populate("followingUsers", "username email") // Populate user details
        .populate("followingLines", "name color"); // Populate train line details
  
      res.status(200).json({
        followingUsers: currentUser.followingUsers,
        followingLines: currentUser.followingLines,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching followed users/lines", error });
    }
  });
  
  module.exports = router;
  