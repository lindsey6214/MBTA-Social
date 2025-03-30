const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");
const Post = require("../../models/postModel");
const User = require("../../models/userModel");

// Create a new comment
router.post("/createComment", async (req, res) => {
  const { postID, userID, username, content, parentComment } = req.body;

  try {
    // Check if the post exists
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new comment
    const newComment = new Comment({
      postID,
      userID,
      username,
      content,
      parentComment,
    });

    // Save to database
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error trying to create new comment" });
  }
});

module.exports = router;