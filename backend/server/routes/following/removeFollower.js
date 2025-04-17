const express = require("express");
const User = require("../../models/userModel");

const router = express.Router();

router.post("/remove/follower/:followerId", async (req, res) => {
  const { followerId } = req.params;
  const { currentUserId } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);
    const follower = await User.findById(followerId);

    if (!currentUser || !follower) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.followingUsers = currentUser.followingUsers.filter(
      (id) => id.toString() !== followerId
    );

    follower.followingUsers = follower.followingUsers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await follower.save();

    res.status(200).json({ message: "Follower removed." });
  } catch (error) {
    res.status(500).json({ message: "Error removing follower", error });
  }
});

module.exports = router;
