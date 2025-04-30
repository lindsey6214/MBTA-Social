const express = require("express");
const router = express.Router();
const TrainLine = require("../../models/trainLineModel");
const User = require("../../models/userModel");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const allLinesFromAPI = await TrainLine.getTrainLines();
    const simplifiedLines = allLinesFromAPI.data.map((line) => ({
      mbtaId: line.id,
      name: line.attributes.long_name,
      color: line.attributes.color,
      type: line.attributes.type,
    }));

    if (userId) {
      const user = await User.findById(userId).populate("followingLines", "mbtaId");
      const followedIds = user.followingLines.map((line) => line.mbtaId);

      // Flag which lines are followed
      simplifiedLines.forEach((line) => {
        line.followed = followedIds.includes(line.mbtaId);
      });
    }

    res.status(200).json(simplifiedLines);
  } catch (error) {
    console.error("Failed to fetch train lines:", error);
    res.status(500).json({ message: "Unable to load train lines", error });
  }
});

module.exports = router;
