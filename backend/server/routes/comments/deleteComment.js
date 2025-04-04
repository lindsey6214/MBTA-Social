const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");

// Delete all comments
router.delete("/deleteAllComments", async (req, res) => {
  try {
    // Delete all comments from the collection
    await Comment.deleteMany({});
    res.status(200).json({ message: "All comments deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error trying to delete comments" });
  }
});

// Delete a comment
router.delete("/deleteComment/:commentID", async (req, res) => {
  const { commentID } = req.params;

  try {
    // Check if the comment exists
    const comment = await Comment.findById(commentID);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentID);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error trying to delete comment" });
  }
});

module.exports = router;