const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Post = require("../../models/postModel");
const User = require("../../models/userModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST /posts/createPost
router.post("/createPost", upload.single("media"), async (req, res) => {
    const { userId, username, content } = req.body;
  const imageUri = req.file ? `/uploads/${req.file.filename}` : null;

  // 🧠 Debug logs — keep these for now
  console.log("📦 POST BODY:", req.body);
  console.log("🖼 UPLOADED FILE:", req.file);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      userId,
      username,
      content,
      imageUri,
      isSensitive,
      hasOffensiveText,
      trainLineId, // NEW
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ message: "Server error creating post" });
  }
});

module.exports = router;
