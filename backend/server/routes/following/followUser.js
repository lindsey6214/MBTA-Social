const express = require("express");
const User = require("../../models/userModel");

const router = express.Router();

router.post("/follow/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { currentUserId } = req.body; // Pass current user ID in request body

      const currentUser = await User.findById(currentUserId);
      if (!currentUser) return res.status(404).json({ message: "Current user not found" });

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

module.exports = router;
