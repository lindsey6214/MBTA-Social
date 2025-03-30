const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel"); 
const User = require("../../models/userModel"); 

// Create a new post
router.post("/createPost", async (req, res) => {
  const { userId, content, imageUri, isSensitive, hasOffensiveText, username } = req.body;

  try {
    // Check if the user exists
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // Create new post
    const newPost = new Post({
      userId,
      username,
    
     // username: user.username, // Get username from the user model
      content,
      imageUri,
      isSensitive,
      hasOffensiveText,
    });

    // Save to database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error trying to create new post" });
  }
});

module.exports = router;
