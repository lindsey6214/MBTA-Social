const express = require('express');
const Post = require('../models/postModel');
const router = express.Router();

// Explore nearby posts
router.get('/nearby', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required.' });
  }

  try {
    const userLocation = {
      type: 'Point',
      coordinates: [parseFloat(lon), parseFloat(lat)]
    };

    const nearbyPosts = await Post.aggregate([
      {
        $geoNear: {
          near: userLocation,
          distanceField: "dist.calculated",
          spherical: true,
          maxDistance: 50000, // 50 kilometers radius
        }
      },
      {
        $sort: { "dist.calculated": 1 } // Closest first
      },
      {
        $limit: 50
      }
    ]);

    res.status(200).json(nearbyPosts);
  } catch (error) {
    console.error("Error fetching nearby posts:", error);
    res.status(500).json({ message: "Error fetching nearby posts", error });
  }
});

module.exports = router;
