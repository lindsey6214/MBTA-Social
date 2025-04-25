const mongoose = require("mongoose");

// Comment schema/model
const newCommentSchema = new mongoose.Schema(
  {
    postID: { type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    username: { type: String, required: true },
    content: {
      type: String,
      required: true,
      maxlength: 200,
      set: (value) => value.slice(0, 200)
    },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "comments", default: null },
    moderationFlag: { type: String, enum: ['clean', 'censored'], default: 'clean' },
    mentions: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "comments" }
);

module.exports = mongoose.model("comments", newCommentSchema);