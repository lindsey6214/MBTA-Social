const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON requests

// Simulated database
const posts = {
    1: { likes: 0, likedBy: new Set() },
    2: { likes: 5, likedBy: new Set() },
};

app.post('/like/:postId', (req, res) => {
    const postId = parseInt(req.params.postId);
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "You are not logged in." });
    }

    if (!posts[postId]) {
        return res.status(404).json({ error: "Post not found." });
    }

    if (posts[postId].likedBy.has(userId)) {
        return res.status(403).json({ error: "You have already liked this post" });
    }

    // Add like and store user
    posts[postId].likes += 1;
    posts[postId].likedBy.add(userId);

});

module.exports = router;
