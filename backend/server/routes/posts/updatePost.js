const express = require('express');
const router = express.Router();
const newPostModel = require('../../models/postModel');

router.put('/updatePost/:postId', async (req, res) => {  const { postId } = req.params;
  const { isSensitive, content } = req.body;

  try {
    const post = await newPostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update post fields
    if (typeof isSensitive !== 'undefined') {
      post.isSensitive = isSensitive;
    }
    if (typeof content !== 'undefined') {
      post.content = content;
    }

    await post.save();

    // Send response
    res.status(200).json({
      msg: "Post updated successfully",
      content: post.content,
      post
    });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Error updating post' });
  }
});

module.exports = router;