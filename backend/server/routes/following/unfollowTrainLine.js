const express = require("express");
const User = require("../models/User");
const TrainLine = require("../models/TrainLine");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/unfollow/line/:lineId", authenticate, async (req, res) => {
    try {
      const { lineId } = req.params;
      const currentUser = req.user;
  
      currentUser.followingLines = currentUser.followingLines.filter(
        (id) => id.toString() !== lineId
      );
      await currentUser.save();
  
      res.status(200).json({ message: "Train line unfollowed successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing train line", error });
    }
  });