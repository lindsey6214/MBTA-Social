const express = require("express");
const axios = require("axios");
const User = require("../../models/userModel");
const TrainLine = require("../../models/trainLineModel");

const router = express.Router();
const MBTA_API_BASE = 'https://api-v3.mbta.com';
const API_KEY = process.env.MBTA_API_KEY;

router.post("/following/line/:lineId", async (req, res) => {
  try {
    const { lineId } = req.params;
    const { userId } = req.body;

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    let trainLine = await TrainLine.findOne({ mbtaId: lineId });

    if (!trainLine) {
      const mbtaResponse = await axios.get(`${MBTA_API_BASE}/routes/${lineId}`, {
        params: { api_key: API_KEY },
      });

      if (!mbtaResponse.data.data) {
        return res.status(404).json({ message: "Train line not found in MBTA API" });
      }

      const attributes = mbtaResponse.data.data.attributes;

      trainLine = new TrainLine({
        mbtaId: lineId,
        name: attributes.long_name,
        color: attributes.color,
        type: attributes.type,
      });

      await trainLine.save();
    }

    if (!currentUser.followingLines.includes(lineId)) {
      currentUser.followingLines.push(lineId);
      await currentUser.save();
    }

    const scheduleResponse = await axios.get(`${MBTA_API_BASE}/schedules`, {
      params: { "filter[route]": lineId, "page[limit]": 10, api_key: API_KEY },
    });

    const alertsResponse = await axios.get(`${MBTA_API_BASE}/alerts`, {
      params: { "filter[route]": lineId, api_key: API_KEY },
    });

    const posts = await Post.find({ trainLineId: lineId }).sort({ date: -1 });

    res.status(200).json({
      message: "Train line followed successfully!",
      schedule: scheduleResponse.data.data,
      alerts: alertsResponse.data.data,
      posts, //new
    });
  } catch (error) {
    res.status(500).json({ message: "Error following train line", error: error.message });
  }
});

module.exports = router;
