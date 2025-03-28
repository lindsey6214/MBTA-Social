const {v4 : uuid} = require("uuid"); //creates unique id
const mongoose = require ("mongoose");

const commentSchema = new mongoose.Schema({
    commentID: { type: String, default: uuidv4, unique: true },
    postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
});

const Comment = mongoose.model("Comment", commentSchema);

class createComment{
    constructor(postID, userID, content, parentComment = null){
        this.commentID = uuidv4;
        this.postID = postID;
        this.userID = userID;
        this.username = this.username;
        this.content = content;
        this.timestamp = new Date();
        this.parentComment = parentComment;
    }
}

validateContent();{
    return this.content && this.content.trim().length > 0 && this.content.length >= 500;
};
//save to database
saveToDatabase();{
    if (!this.validateContent()){
        console.log("Error: content empty, cannot post an empty comment");
        return{success: false, message: "no content found"};
    }
    try{
        const newComment = new Comment({
            commentID: this.commentID,
            postID: this.postID,
            userID: this.userID,
            username: this.username,
            content: this.content,
            timestamp: this.timestamp,
            parentComment: this.parentComment
        });
        await newComment.save();
        return{success: true, message: "sucessfully saved to database!!! yay :)", Comment: newComment};
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Failed to save comment" };
    }

}
async function createNewComment() {
    const newComment = new CreateComment("post123", "user456", "JohnDoe", "Great post!");
    const result = await newComment.saveToDatabase();
    console.log(result);
}

// Call function to test
createNewComment();

module.exports = CreateComment;
