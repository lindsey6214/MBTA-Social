const express = require("express");
const User = require("../../models/userModel");

const router = express.Router();

router.post("/unfollow/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { currentUserId } = req.body;

      const currentUser = await User.findById(currentUserId);
      if (!currentUser) return res.status(404).json({ message: "Current user not found" });

      currentUser.followingUsers = currentUser.followingUsers.filter(
        (id) => id.toString() !== userId
      );
      await currentUser.save();

      res.status(200).json({ message: "User unfollowed successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing user", error });
    }
});

module.exports = router;
