const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");
const User = require("../../models/userModel");
const { preprocessText, moderateContent, censorContent } = require("../../utilities/openaiService");
const customFlags = require("../../utilities/customFlags");

// Helper function to extract @mentions
const extractMentions = (text) => {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = new Set();
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.add(match[1]);
  }
  return [...mentions];
};

// Update a comment by its ID
router.put("/updateComment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);
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

      // Extract and validate mentions
      const mentionedUsernames = extractMentions(content);
      const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
      const validUsernames = mentionedUsers.map((u) => u.username);
      const invalidMentions = mentionedUsernames.filter((u) => !validUsernames.includes(u));

      if (invalidMentions.length > 0) {
        return res.status(400).json({
          error: `Invalid mention(s): @${invalidMentions.join(", @")}. Please use only valid and active usernames.`
        });
      }

      comment.content = censoredText;
      comment.moderationFlag = censoredText !== content ? "censored" : "clean";
      comment.mentions = validUsernames;
    }

    await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Error updating comment" });
  }
});

module.exports = router;