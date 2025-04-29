const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (userId, email, username) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables.");
  }

  return jwt.sign(
    { _id: userId, email, username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

module.exports.generateAccessToken = generateAccessToken;