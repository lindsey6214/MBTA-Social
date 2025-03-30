const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/userModel");

const ADMIN_ACCESS_CODE = "BlueLineIsTheBestLine12345";

router.post("/makeUserAnAdmin", async (req, res) => {
    const { email, password, accessCode } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // Check if the access code is correct
        if (accessCode !== ADMIN_ACCESS_CODE) {
            return res.status(403).json({ message: "Invalid admin access code." });
        }

        // Update user to be an admin
        user.isAdmin = true;
        await user.save();

        return res.json({ message: "User is now an admin!", user });
    } catch (error) {
        console.error("Error making user an admin:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;