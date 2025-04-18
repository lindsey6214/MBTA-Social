const express = require("express");
const User = require("../../models/userModel");

const router = express.Router();

// Send follow request
router.post("/follow/request/:targetUserId", async (req, res) => {
  const { targetUserId } = req.params;
  const { currentUserId } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.followRequests.includes(currentUserId)) {
      return res.status(400).json({ message: "Follow request already sent." });
    }

    if (targetUser.followingUsers.includes(currentUserId)) {
      return res.status(400).json({ message: "You are already following this user." });
    }

    targetUser.followRequests.push(currentUserId);
    await targetUser.save();

    res.status(200).json({ message: "Follow request sent." });
  } catch (error) {
    res.status(500).json({ message: "Error sending follow request", error });
  }
});

// Accept follow request
router.post("/follow/request/accept/:requesterId", async (req, res) => {
  const { requesterId } = req.params;
  const { currentUserId } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove request
    currentUser.followRequests = currentUser.followRequests.filter(
      (id) => id.toString() !== requesterId
    );

    // Add each other
    if (!currentUser.followingUsers.includes(requesterId)) {
      currentUser.followingUsers.push(requesterId);
    }

    if (!requester.followingUsers.includes(currentUserId)) {
      requester.followingUsers.push(currentUserId);
    }

    await currentUser.save();
    await requester.save();

    res.status(200).json({ message: "Follow request accepted." });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error });
  }
});

// Reject follow request
router.post("/follow/request/reject/:requesterId", async (req, res) => {
  const { requesterId } = req.params;
  const { currentUserId } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    currentUser.followRequests = currentUser.followRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await currentUser.save();
    res.status(200).json({ message: "Follow request rejected." });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting request", error });
  }
});

module.exports = router;
