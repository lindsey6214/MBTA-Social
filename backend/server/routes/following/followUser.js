const express = require("express");
const User = require("../models/User");
const TrainLine = require("../models/TrainLine");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/follow/user/:userId", authenticate, async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = req.user;
  
      if (currentUser._id.toString() === userId) {
        return res.status(400).json({ message: "You cannot follow yourself." });
      }
  
      if (!currentUser.followingUsers.includes(userId)) {
        currentUser.followingUsers.push(userId);
        await currentUser.save();
      }
  
      res.status(200).json({ message: "User followed successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error following user", error });
    }
  });