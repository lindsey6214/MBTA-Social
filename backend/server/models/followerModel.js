const mongoose = require("mongoose");

//follower model schema
const followerschema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        followers:{ 
            type[String],
            required: true,
        },

    },
    {collection: "followers", versionKey: false}
);
module.exports = mongoose.model('followers', followerschema)