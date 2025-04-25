const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");
const Post = require("../../models/postModel");
const User = require("../../models/userModel");

const {
  preprocessText,
  moderateContent,
  censorContent,
} = require("../../utilities/openaiService");

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

// Create a new comment
router.post("/createComment", async (req, res) => {
  const { postID, userID, username, content, parentComment } = req.body;

  try {
    // Validate post existence
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Validate user existence
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Preprocess and moderate
    const normalizedContent = preprocessText(content);
    const moderationResult = await moderateContent(normalizedContent);
    if (moderationResult.flagged) {
      return res.status(403).json({
        message: "Comment rejected due to inappropriate content.",
        categories: moderationResult.categories,
      });
    }

    // Censor the content
    const censoredContent = await censorContent(normalizedContent, ["slur", "curse"]);

    // Extract and validate mentions
    const mentionedUsernames = extractMentions(content);
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
    const validUsernames = mentionedUsers.map((u) => u.username);
    const invalidMentions = mentionedUsernames.filter((u) => !validUsernames.includes(u));

    if (invalidMentions.length > 0) {
      return res.status(400).json({
        message: `Invalid mention(s): @${invalidMentions.join(", @")}. Please use only valid and active usernames.`,
      });
    }

    // Create and save the comment
    const newComment = new Comment({
      postID,
      userID,
      username,
      content: censoredContent,
      parentComment: parentComment || null,
      moderationFlag: moderationResult.flagged ? "censored" : "clean",
      mentions: validUsernames,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("❌ Error creating comment:", error);
    res.status(500).json({ message: "Error trying to create new comment" });
  }
});

module.exports = router;