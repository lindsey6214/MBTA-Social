const express = require("express");
const axios = require("axios");
const User = require("../../models/userModel");
const TrainLine = require("../../models/trainLineModel");

const router = express.Router();
const MBTA_API_BASE = "https://api-v3.mbta.com";
const API_KEY = process.env.MBTA_API_KEY;

router.post("/line/:lineId", async (req, res) => {
  try {
    const { lineId } = req.params;
    const { userId } = req.body;

    const sanitizedLineId = lineId.trim().replace(/'/g, "");

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Check if train line already exists
    let trainLine = await TrainLine.findOne({ mbtaId: sanitizedLineId });

    if (!trainLine) {
      const mbtaResponse = await axios.get(`${MBTA_API_BASE}/routes/${sanitizedLineId}`, {
        params: { api_key: API_KEY },
      });

      if (!mbtaResponse.data.data) {
        return res.status(404).json({ message: "Train line not found in MBTA API" });
      }

      const attributes = mbtaResponse.data.data.attributes;

      trainLine = new TrainLine({
        mbtaId: sanitizedLineId,
        name: attributes.long_name,
        color: attributes.color,
        type: attributes.type,
      });

      await trainLine.save();
    }

    // Only add if not already following
    if (!currentUser.followingLines.includes(trainLine._id)) {
      currentUser.followingLines.push(trainLine._id);
      await currentUser.save();
    }

    // Optional: fetch real-time data
    const [scheduleResponse, alertsResponse] = await Promise.all([
      axios.get(`${MBTA_API_BASE}/schedules`, {
        params: { "filter[route]": sanitizedLineId, "page[limit]": 10, api_key: API_KEY },
      }),
      axios.get(`${MBTA_API_BASE}/alerts`, {
        params: { "filter[route]": sanitizedLineId, api_key: API_KEY },
      }),
    ]);

    res.status(200).json({
      message: "Train line followed successfully!",
      schedule: scheduleResponse.data.data,
      alerts: alertsResponse.data.data,
    });
  } catch (error) {
    console.error("Error in followTrainLine:", error.message);
    res.status(500).json({ message: "Error following train line", error: error.message });
  }
});

module.exports = router;
