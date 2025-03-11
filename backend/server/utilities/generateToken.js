const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (userId, email, username) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables.");
  }

  return jwt.sign(
    { id: userId, email, username }, // Removed password from payload
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Adjusted expiration time for better usability
  );
};

module.exports.generateAccessToken = generateAccessToken;