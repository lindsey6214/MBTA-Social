const express = require("express");
const User = require("../models/User");
const TrainLine = require("../models/TrainLine");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/unfollow/user/:userId", authenticate, async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = req.user;
  
      currentUser.followingUsers = currentUser.followingUsers.filter(
        (id) => id.toString() !== userId
      );
      await currentUser.save();
  
      res.status(200).json({ message: "User unfollowed successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing user", error });
    }
  });