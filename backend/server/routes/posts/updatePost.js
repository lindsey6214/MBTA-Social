const express = require('express');
const router = express.Router();
const Post = require('../../models/postModel');
const User = require('../../models/userModel');
const { preprocessText, moderateContent, censorContent } = require('../../utilities/openaiService');
const customFlags = require('../../utilities/customFlags');

// Helper function to extract @mentions from content
const extractMentions = (text) => {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = new Set();
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.add(match[1]);
  }
  return [...mentions];
};

// Update a post by its ID with moderation and mention validation
router.put('/updatePost/:postId', async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (typeof content !== 'undefined') {
      const normalized = preprocessText(content);
      const moderationResult = await moderateContent(normalized);

      if (moderationResult.flagged) {
        return res.status(400).json({ error: "Post contains inappropriate content." });
      }

      const censoredText = await censorContent(content, customFlags);

      // Extract and validate mentions
      const mentionedUsernames = extractMentions(content);
      const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
      const validUsernames = mentionedUsers.map(u => u.username);
      const invalidMentions = mentionedUsernames.filter(u => !validUsernames.includes(u));

      if (invalidMentions.length > 0) {
        return res.status(400).json({
          error: `Invalid mention(s): @${invalidMentions.join(", @")}. Please use only valid and active usernames.`
        });
      }

      post.content = censoredText;
      post.moderationFlag = censoredText !== content ? 'censored' : 'clean';
      post.mentions = validUsernames;
    }

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post
    });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Error updating post' });
  }
});

module.exports = router;