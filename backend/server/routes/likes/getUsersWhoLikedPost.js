const express = require("express");
const router = express.Router();
const Like = require("../../models/Like");

router.get("/users/:postID", async (req, res) => {
  try {
    const likes = await Like.find({ postID: req.params.postID }).populate("userID", "username");
    res.json(likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
