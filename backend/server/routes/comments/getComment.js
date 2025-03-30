const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");

// Get all comments
router.get("/comments", async (req, res) => {
    try {
        const allComments = await Comment.find();
        return res.status(200).json(allComments);
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch comments" });
    }
});

// Get comments by post ID
router.get("/comments/post/:postID", async (req, res) => {
    try {
        const { postID } = req.params;
        const comments = await Comment.find({ postID }).sort({ timestamp: -1 });

        if (!comments.length) {
            return res.status(404).json({ message: "No comments found for this post" });
        }

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch comments" });
    }
});

// Get a specific comment by its ID
router.get("/comments/:commentID", async (req, res) => {
    try {
        const { commentID } = req.params;
        const comment = await Comment.findOne({ commentID });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch comment" });
    }
});

module.exports = router;