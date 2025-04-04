const express = require("express");
const router = express.Router();
const Like = require("../../models/Like");

router.delete("/:postID/:userID", async (req, res) => {
  try {
    const { postID, userID } = req.params;
    await Like.findOneAndDelete({ postID, userID });
    res.status(200).json({ message: "Like removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
