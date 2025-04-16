const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const geolib = require("geolib");

router.get("/nearby", async (req, res) => {
  const { lat, lng, radius } = req.query;
  const radiusMeters = (radius || 20) * 1609.34;

  try {
    const posts = await Post.find({});
    const nearby = posts.filter((post) => {
      if (!post.location) return false;
      const [postLat, postLng] = post.location.split(",").map(Number);
      return geolib.getDistance(
        { latitude: lat, longitude: lng },
        { latitude: postLat, longitude: postLng }
      ) <= radiusMeters;
    });
    res.json(nearby);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch nearby posts." });
  }
});

module.exports = router;
