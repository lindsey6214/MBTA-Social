const mongoose = require("mongoose");
const axios = require ("axios");

const MBTA_API_BASE_URL = 'https://api-v3.mbta.com';
const API_KEY = process.env.MBTA_API_KEY;

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

async function getTrainLines(){
  try{
    //filter train routes
    const response = await axios.get(`{$MBTA_API_BASE_URL}/routes`, {
      params: {
        //filter routes for trainlines 
        'filter[type]': '0,1',
        api_key: API_KEY
      }
    });
    return response.data;
  }catch (error){
    console.error('error fetching train lines', error);
    throw error;
  }
}

const TrainLine = mongoose.model("TrainLine", trainLineSchema);

module.exports = { MBTA_API_BASE_URL, API_KEY };
module.exports = TrainLine;
module.exports = {getTrainLines};
