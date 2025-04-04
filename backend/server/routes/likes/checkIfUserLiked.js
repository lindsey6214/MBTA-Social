const express = require("express");
const router = express.Router();
const Like = require("../../models/Like");

router.get("/:postID/:userID", async (req, res) => {
  try {
    const { postID, userID } = req.params;
    const like = await Like.findOne({ postID, userID });
    res.status(200).json({ liked: !!like });  // returns true or false
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
