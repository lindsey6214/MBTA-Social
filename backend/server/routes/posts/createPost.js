const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");
const User = require("../../models/userModel");
const moderationMiddleware = require("../../middleware/moderationMiddleware");

// Create a new post with moderation
router.post("/createPost", moderationMiddleware, async (req, res) => {
  const { userId, content, imageUri, username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      userId,
      username,
      content,
      imageUri,
      moderationFlag: req.censored ? "censored" : "clean",
    });

    // Save to database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: "Error trying to create new post" });
  }
});

module.exports = router;