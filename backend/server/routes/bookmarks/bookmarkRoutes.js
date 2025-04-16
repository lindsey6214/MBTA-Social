const express = require("express");
const router = express.Router();
const Bookmark = require("../../models/bookmarkModel");
const Post = require("../../models/postModel");

// GET /bookmarks/:userId - fetch bookmarks for a user
router.get("/:userId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId }).populate("postId");
    const posts = bookmarks.map((b) => b.postId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookmarks." });
  }
});

// POST /bookmarks/add - add a new bookmark
router.post("/add", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const exists = await Bookmark.findOne({ userId, postId });
    if (exists) return res.status(200).json({ message: "Already bookmarked." });

    const bookmark = new Bookmark({ userId, postId });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Failed to add bookmark." });
  }
});

// DELETE /bookmarks/remove/:userId/:postId - remove bookmark
router.delete("/remove/:userId/:postId", async (req, res) => {
  try {
    await Bookmark.deleteOne({ userId: req.params.userId, postId: req.params.postId });
    res.status(200).json({ message: "Bookmark removed." });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove bookmark." });
  }
});

module.exports = router;
