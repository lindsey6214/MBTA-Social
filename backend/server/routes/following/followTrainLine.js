const express = require("express");
const User = require("../../models/userModel");
const TrainLine = require("../../models/trainLineModel");

const router = express.Router();

router.post("/following/line/:lineId", async (req, res) => {
    try {
      const { lineId } = req.params;
      const { userId } = req.body; // Pass user ID in request body

      const currentUser = await User.findById(userId);
      if (!currentUser) return res.status(404).json({ message: "User not found" });

      const trainLine = await TrainLine.findOne({ mbtaId: lineId });
      if (!trainLine) return res.status(404).json({ message: "Train line not found" });

      if (!currentUser.followingLines.includes(lineId)) {
        currentUser.followingLines.push(lineId);
        await currentUser.save();
      }

      res.status(200).json({ message: "Train line followed successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error following train line", error });
    }
});

module.exports = router;
