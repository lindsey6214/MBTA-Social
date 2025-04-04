const express = require("express");
const User = require("../../models/userModel");

const router = express.Router();

router.get("/following/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const currentUser = await User.findById(userId)
        .populate("followingUsers", "username email")
        .populate("followingLines", "name color");

      if (!currentUser) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        followingUsers: currentUser.followingUsers,
        followingLines: currentUser.followingLines,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching followed users/lines", error });
    }
});

module.exports = router;
