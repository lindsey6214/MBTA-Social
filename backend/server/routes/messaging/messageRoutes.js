const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Message = require("../../models/messageModel");

// Send a message
router.post("/send", async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await Message.create({ senderId, receiverId, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get conversation between two users
router.get("/conversation", async (req, res) => {
  const { senderId, receiverId } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load conversation" });
  }
});

// Let a user view all conversations they are involved in
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: new mongoose.Types.ObjectId(userId) }, { receiverId: new mongoose.Types.ObjectId(userId) }]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $lt: ["$senderId", "$receiverId"] },
              { sender: "$senderId", receiver: "$receiverId" },
              { sender: "$receiverId", receiver: "$senderId" }
            ]
          },
          messages: { $push: "$$ROOT" }
        }
      }
    ]);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user conversations" });
  }
});

// Delete messages
router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;
  try {
    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});


module.exports = router;