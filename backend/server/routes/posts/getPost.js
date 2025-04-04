const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");

// Get all posts
router.get("/", async (req, res) => {
    try {
        const allPosts = await Post.find();
        return res.status(200).json(allPosts);
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch posts" });
    }
});

// Get posts by user ID
router.get("/user/:userID", async (req, res) => {
    const { userID } = req.params;

    try {
        const posts = await Post.find({ userID }).sort({ timestamp: -1 });

        if (!posts.length) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        return res.status(200).json(posts);
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