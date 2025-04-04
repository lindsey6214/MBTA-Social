const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }
}, { timestamps: true });

likeSchema.index({ userID: 1, postID: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
