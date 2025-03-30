const express = require("express");
const router = express.Router();
const newUserModel = require("../models/userModel");

// Secret access code for deletion
const ACCESS_CODE = "BlueLineIsTheBestLine12345";

// Route to delete a user by email using the access code
router.delete("/deleteUserByEmail", async (req, res) => {
  const { email, accessCode } = req.body;

  try {
    // Check if the provided access code matches
    if (accessCode !== ACCESS_CODE) {
      return res.status(403).json({ message: "Access denied. Invalid code." });
    }

    // Find and delete the user by email
    const deletedUser = await newUserModel.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;