const express = require('express');
const router = express.Router();
const Post = require("../../models/postModel");
const User = require("../../models/userModel");

router.get("/homeFeed/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({
      $or: [
        { userId: user._id },
        { userId: { $in: user.followingUsers } },
        { trainLineId: { $in: user.followingLines } }
      ]
    }).sort({ timestamp: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
