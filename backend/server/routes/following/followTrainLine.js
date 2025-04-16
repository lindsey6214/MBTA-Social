const express = require("express");
const axios = require("axios");
const User = require("../../models/userModel");
const TrainLine = require("../../models/trainLineModel");
const { getTrainLines } = require('./trainLineModel');
const followerModel = require('./followerModel');
const followingModel = require('./followingModel');

const router = express.Router();
const MBTA_API_BASE = 'https://api-v3.mbta.com'

router.post("/following/line/:lineId", async (req, res) => {
    try {
      const { lineId } = req.params;
      const { userId } = req.body; // Pass user ID in request body

      const currentUser = await User.findById(userId);
      if (!currentUser) return res.status(404).json({ message: "User not found" });

      const trainLine = await TrainLine.findOne({ mbtaId: lineId });
      if (!trainLine) return res.status(404).json({ message: "Train line not found" });

      if (!currentUser.followingLines.includes(lineId)) {
        currentUser.followingLines.push(lineId);
        await currentUser.save();
      }
      // fetch shcedule from api
      const scheduleResponse = await axios.get(`${MBTA_API_BASE}/schedules,`{
        params: {"filter[route]": lineId, "page[limit]": 10},
      });
      // fetch alerts from api
      const alertsResponse = await axios.get(`${MBTA_API_BASE}/alerts`, {
        params: {"filter[rout]": lineID},
      });
      const schedules = scheduleResponse.data.data;
      const alerts = alertsResponse.data.data;

      res.status(200).json({ message: "Train line followed successfully!",
        schedule: schedules,
        alerts: alerts,
       });
    } catch (error) {
      res.status(500).json({ message: "Error following train line", error: error.message });
    }
});

module.exports = router;
