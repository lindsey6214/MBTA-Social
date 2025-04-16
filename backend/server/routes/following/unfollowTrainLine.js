const express = require("express");
const User = require("../../models/userModel");
const TrainLine = require("../../models/trainLineModel");

const router = express.Router();

router.post("/unfollow/line/:lineId", async (req, res) => {
  try {
    const { lineId } = req.params;
    const { userId } = req.body;
    const sanitizedLineId = lineId.trim().replace(/'/g, "");

    //find user
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

//     currentUser.followingLines = currentUser.followingLines.filter(
//       (id) => id !== lineId
//     );
//     await currentUser.save();

//     res.status(200).json({ message: "Train line unfollowed successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error unfollowing train line", error: error.message });
//   }
// });

// module.exports = router;

 // Find the train line by mbtaId
 const trainLine = await TrainLine.findOne({ mbtaId: sanitizedLineId });
 if (!trainLine) return res.status(404).json({ message: "Train line not found in database" });

 const trainLineId = trainLine._id.toString();

 // Filter out the line from user's following list
 const originalCount = currentUser.followingLines.length;
 currentUser.followingLines = currentUser.followingLines.filter(
   (id) => id.toString() !== trainLineId
 );

 // Save only if something changed
 if (currentUser.followingLines.length < originalCount) {
   await currentUser.save();
 }

 res.status(200).json({ message: "Train line unfollowed successfully!" });
} catch (error) {
 console.error("Error in unfollowTrainLine:", error.message);
 res.status(500).json({ message: "Error unfollowing train line", error: error.message });
}
});

module.exports = router;
