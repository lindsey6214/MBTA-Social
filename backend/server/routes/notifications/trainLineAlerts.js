const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const TrainLine = require("../../models/trainLineModel");
const axios = require("axios");

const MBTA_API_BASE = "https://api-v3.mbta.com";
const API_KEY = process.env.MBTA_API_KEY;

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("followingLines");
    if (!user) return res.status(404).json({ message: "User not found" });

    const alerts = await Promise.all(
      user.followingLines.map(async (line) => {
        const res = await axios.get(`${MBTA_API_BASE}/alerts`, {
          params: { "filter[route]": line.mbtaId, api_key: API_KEY },
        });
        return res.data.data.map(alert => ({
          id: alert.id,
          lineName: line.name,
          header: alert.attributes.header,
          effect: alert.attributes.effect,
          updatedAt: alert.attributes.updated_at,
        }));
      })
    );

    res.json(alerts.flat());
  } catch (error) {
    console.error("Error fetching alerts:", error.message);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

module.exports = router;
