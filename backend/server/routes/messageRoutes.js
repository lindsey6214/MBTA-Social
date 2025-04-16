const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
