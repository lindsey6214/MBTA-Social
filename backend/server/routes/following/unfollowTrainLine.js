const express = require("express");
const User = require("../../models/userModel");

const router = express.Router();

router.post("/unfollow/line/:lineId", async (req, res) => {
  try {
    const { lineId } = req.params;
    const { userId } = req.body;

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    currentUser.followingLines = currentUser.followingLines.filter(
      (id) => id !== lineId
    );
    await currentUser.save();

    res.status(200).json({ message: "Train line unfollowed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing train line", error: error.message });
  }
});

module.exports = router;
