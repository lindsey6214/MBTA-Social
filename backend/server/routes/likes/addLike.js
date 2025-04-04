const express = require("express");
const router = express.Router();
const Like = require("../../models/Like");

router.post("/", async (req, res) => {
  try {
    const { userID, postID } = req.body;
    const existingLike = await Like.findOne({ userID, postID });
    if (existingLike) {
      return res.status(400).json({ message: "User already liked this post." });
    }

    const newLike = new Like({ userID, postID });
    await newLike.save();
    res.status(201).json(newLike);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

