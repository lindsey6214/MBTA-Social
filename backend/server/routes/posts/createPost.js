const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");
const User = require("../../models/userModel");
const moderationMiddleware = require("../../middleware/moderationMiddleware");

// Create a new post with moderation
router.post("/createPost", moderationMiddleware, async (req, res) => {
  const { userId, content, mediaUris, username } = req.body;

  try {
    const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (mediaUris && mediaUris.length > 4) {
      return res.status(400).json({ message: "A post can only contain up to 4 images or videos." });
    }
    
    const newPost = new Post({
      userId,
      username,
      content,
      mediaUris,
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