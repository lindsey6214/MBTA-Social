
const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel')

router.get('/posts', async (req, res) => {
    const allPosts = await newPostModel.find()
    return res.status(200).json(allPosts)
    
})   

module.exports = router;