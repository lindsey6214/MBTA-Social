const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");

// Update a comment by its ID
router.put("/updateComment/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const comment = await Comment.findOne({ commentID: commentId });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Update the comment content
        if (typeof content !== "undefined") {
            comment.content = content;
        }

        await comment.save();

        // Send response
        res.status(200).json({
            msg: "Comment updated successfully",
            content: comment.content,
            comment
        });
    } catch (err) {
        console.error("Error updating comment:", err);
        res.status(500).json({ error: "Error updating comment" });
    }
});

module.exports = router;