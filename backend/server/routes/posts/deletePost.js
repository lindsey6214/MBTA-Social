const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");

// Delete all posts
router.delete("/deleteAllPosts", async (req, res) => {
  try {
    // Delete all posts from the collection
    await Post.deleteMany({});
    res.status(200).json({ message: "All posts deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error trying to delete posts" });
  }
});

// Delete a specific post
router.delete("/deletePost/:postID", async (req, res) => {
  const { postID } = req.params;

  try {
    // Check if the post exists
    const post = await Post.findById(postID);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post
    await Post.findByIdAndDelete(postID);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error trying to delete post" });
  }
});

module.exports = router;