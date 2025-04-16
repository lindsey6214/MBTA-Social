const mongoose = require("mongoose");
const axios = require("axios");

const MBTA_API_BASE_URL = 'https://api-v3.mbta.com';
const API_KEY = process.env.MBTA_API_KEY;

const trainLineSchema = new mongoose.Schema({
  mbtaId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  type: {
    type: String,
  },
});

trainLineSchema.statics.getTrainLines = async function () {
  try {
    const response = await axios.get(`${MBTA_API_BASE_URL}/routes`, {
      params: {
        'filter[type]': '0,1',
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching train lines', error);
    throw error;
  }
};

const TrainLine = mongoose.model("TrainLine", trainLineSchema);

module.exports = TrainLine;

