const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");
const { preprocessText, moderateContent, censorContent } = require("../../utilities/openaiService");
const customFlags = require("../../utilities/customFlags");

// Update a comment by its ID
router.put("/updateComment/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const comment = await Comment.findOne({ commentID: commentId });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (typeof content !== "undefined") {
            const normalized = preprocessText(content);
            const moderationResult = await moderateContent(normalized);

            if (moderationResult.flagged) {
                return res.status(400).json({ error: "Comment contains inappropriate content." });
            }

            const censoredText = await censorContent(content, customFlags);
            comment.content = censoredText;
        }

        await comment.save();

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