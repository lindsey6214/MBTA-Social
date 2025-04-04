const express = require("express");
const User = require("../models/User");
const TrainLine = require("../models/TrainLine");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/follow/line/:lineId", authenticate, async (req, res) => {
    try {
      const { lineId } = req.params;
      const currentUser = req.user;
  
      // Check if train line exists
      const trainLine = await TrainLine.findOne({ mbtaId: lineId });
      if (!trainLine) {
        return res.status(404).json({ message: "Train line not found" });
      }
  
      if (!currentUser.followingLines.includes(lineId)) {
        currentUser.followingLines.push(lineId);
        await currentUser.save();
      }
  
      res.status(200).json({ message: "Train line followed successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error following train line", error });
    }
  });