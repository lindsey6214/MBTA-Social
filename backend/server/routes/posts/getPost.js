const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../../models/postModel");

// Get all posts
router.get("/", async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ timestamp: -1 });
        return res.status(200).json(allPosts);
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch posts" });
    }
});

// Get posts by user ID
router.get("/user/:userID", async (req, res) => {
    const { userID } = req.params;

    try {
        const posts = await Post.find({ userId: new mongoose.Types.ObjectId(userID) }).sort({ timestamp: -1 });

        return res.status(200).json(posts);  // Always return array, even if empty
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch posts" });
    }
});

// Get a specific post by its ID
router.get("/:postID", async (req, res) => {
    const { postID } = req.params;

    try {
        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch post" });
    }
});

module.exports = router;