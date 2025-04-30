const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");
const User = require("../../models/userModel");
const moderationMiddleware = require("../../middleware/moderationMiddleware");

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

// Create a new post with moderation and mention validation
router.post("/createPost", moderationMiddleware, async (req, res) => {
  const { userId, content, mediaUris, username, latitude, longitude, trainLineId } = req.body;

  try {
    // Validate that the author exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate media count
    if (mediaUris && mediaUris.length > 4) {
      return res.status(400).json({ message: "A post can only contain up to 4 images or videos." });
    }

    // Extract mentioned usernames
    const mentionedUsernames = extractMentions(content);
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
    const validUsernames = mentionedUsers.map(u => u.username);
    const invalidMentions = mentionedUsernames.filter(u => !validUsernames.includes(u));

    if (invalidMentions.length > 0) {
      return res.status(400).json({
        message: `Invalid mention(s): @${invalidMentions.join(", @")}. Please use only valid and active usernames.`,
      });
    }

const postData = {
  userId,
  username,
  content,
  mediaUris,
  moderationFlag: req.censored ? "censored" : "clean",
  mentions: validUsernames
};
if (trainLineId) {
  postData.trainLineId = trainLineId;  // 🛤️ attach train line ID
}

// Only add location if both latitude and longitude are present
if (latitude && longitude) {
  postData.location = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)]
  };
}

const newPost = new Post(postData);
const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: "Error trying to create new post" });
  }
});


module.exports = router;