const mongoose = require("mongoose");

const trainLineSchema = new mongoose.Schema({
  mbtaId: {
    type: String,
    required: true,
    unique: true, // Ensure each MBTA line is only stored once
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String, // Example: 'Red', 'Blue', 'Green'
  },
  type: {
    type: String, // Example: 'Subway', 'Commuter Rail'
  },
  routes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route", // If you plan to store routes separately
    },
  ],
});

const TrainLine = mongoose.model("TrainLine", trainLineSchema);

module.exports = TrainLine;
