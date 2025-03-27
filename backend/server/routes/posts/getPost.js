const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel');

router.get('/posts', async (req, res) => {
    try {
        const allPosts = await newPostModel.find();
        return res.status(200).json(allPosts);
    } catch (error) {
        return res.status(500).json({ error: "Server error, unable to fetch posts" });
    }
});

module.exports = router;
