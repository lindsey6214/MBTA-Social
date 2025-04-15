const express = require('express');
const router = express.Router();
const Post = require('../../models/postModel');
const { preprocessText, moderateContent, censorContent } = require('../../utilities/openaiService');
const customFlags = require('../../utilities/customFlags');

// Update a post by its ID with moderation
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
      post.content = censoredText;
      post.moderationFlag = censoredText !== content ? 'censored' : 'clean';
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