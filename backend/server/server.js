const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

const loginRoute = require("./routes/userLogin");
const getAllUsersRoute = require("./routes/userGetAllUsers");
const registerRoute = require("./routes/userSignUp");
const getUserByIdRoute = require("./routes/userGetUserById");
const editUser = require("./routes/userEditUser");
const postDeleteAll = require("./routes/postDeleteAll");
const createPost =require("./routes/posts/createPost")
const dbConnection = require("./config/db.config");


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

    app.use("/user", loginRoute);
    app.use("/user", registerRoute);
    app.use("/user", getAllUsersRoute);
    app.use("/user", getUserByIdRoute);
    app.use("/user", editUser);
    app.use("/post", postDeleteAll);
    app.use("/post", createPost);

    // post routes
    app.use(require("./routes/posts/post.getAllPosts"));

    // Global error handler
    app.use((err, req, res, next) => {
      console.error("❌ Error:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    });

    app.listen(SERVER_PORT, () => {
      console.log(`🚀 Server running on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });