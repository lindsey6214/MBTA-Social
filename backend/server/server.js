const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

const loginRoute = require("./routes/userLogin");
const getAllUsersRoute = require("./routes/userGetAllUsers");
const makeUserAnAdmin = require("./routes/makeUserAnAdmin");
const registerRoute = require("./routes/userSignUp");
const getUserByIdRoute = require("./routes/userGetUserById");
const editUser = require("./routes/userEditUser");
const userDeleteUser = require("./routes/userDeleteUser");
const createPost = require("./routes/posts/createPost");
const getPost = require("./routes/posts/getPost");
const updatePost = require("./routes/posts/updatePost");
const deletePost = require("./routes/posts/deletePost");
const createComment = require("./routes/comments/createComment");
const getComment = require("./routes/comments/getComment");
const updateComment = require("./routes/comments/updateComment");
const deleteComment = require("./routes/comments/deleteComment");
const dbConnection = require("./config/db.config");
const addLike = require("./routes/likes/addLike");
const removeLike = require("./routes/likes/removeLike");
const getLikesByPost = require("./routes/likes/getLikesByPost");
const getUsersWhoLikedPost = require("./routes/likes/getUsersWhoLikedPost");
const checkIfUserLiked = require("./routes/likes/checkIfUserLiked");

const followTrainLine = require("./routes/following/followTrainLine");
const followUser = require("./routes/following/followUser");
const getFollowing = require("./routes/following/getFollowing");
const unfollowTrainLine = require("./routes/following/unfollowTrainLine");
const unfollowUser = require("./routes/following/unfollowUser");


dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8081;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*";

const app = express();

// Ensure database connection before starting server
dbConnection()
  .then(() => {
    console.log("✅ Connected to the database.");

    app.use(cors({ origin: ALLOWED_ORIGINS }));
    app.use(express.json());
    app.use(morgan("dev")); // Logs HTTP requests

    // User-related routes
    app.use("/user", loginRoute);
    app.use("/user", registerRoute);
    app.use("/user", getAllUsersRoute);
    app.use("/user", getUserByIdRoute);
    app.use("/user", editUser);
    app.use("/user", userDeleteUser);
    app.use("/user", makeUserAnAdmin);

    // Post-related routes
    app.use("/posts", createPost);
    app.use("/posts", getPost);
    app.use("/posts", updatePost);
    app.use("/posts", deletePost);

    // Comment routes
    app.use("/comments", createComment);
    app.use("/comments", getComment);
    app.use("/comments", updateComment);
    app.use("/comments", deleteComment);
    
    app.use("/likes", addLike);
    app.use("/likes", removeLike);
    app.use("/likes", getLikesByPost);
    app.use("/likes", getUsersWhoLikedPost);
    app.use("/likes", checkIfUserLiked); 

    // Follow routes
    app.use("./following", followTrainLine);
    app.use("./following", followUser);
    app.use("./following", getFollowing);
    app.use("./following", unfollowTrainLine);
    app.use("./following", unfollowUser);


    // Global error handler
    app.use((err, req, res, next) => {
      console.error("❌ Error:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    });

    // Start the server
    app.listen(SERVER_PORT, () => {
      console.log(`🚀 Server running on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });