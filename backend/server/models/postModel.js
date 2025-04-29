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
          return val.length <= 4;
        },
        message: "A post can contain up to 4 images or videos."
        },
      default: []
    },
    moderationFlag: { type: String, enum: ['clean', 'censored'], default: 'clean' },
    mentions: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },

    // 🚀 NEW field: location
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined
      }
    }
  },
  { collection: "posts" }
);
newPostSchema.index({ location: "2dsphere" });


module.exports = mongoose.model("posts", newPostSchema);