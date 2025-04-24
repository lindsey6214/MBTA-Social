const mongoose = require("mongoose");

// Post schema/model
const newPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    username: { type: String, required: true },
    content: {
      type: String,
      required: true,
      maxlength: 500,
      set: (value) => value.slice(0, 500)
    },
    mediaUris: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 4; // Limit to 4 items max
        },
        message: "A post can contain up to 4 images or videos."
      },
      default: []
    },
    timestamp: { type: Date, default: Date.now },
    moderationFlag: { type: String, enum: ['clean', 'censored'], default: 'clean' },
  },
  { collection: "posts" }
);

module.exports = mongoose.model("posts", newPostSchema);