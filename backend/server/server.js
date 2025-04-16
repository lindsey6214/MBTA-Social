const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const bookmarkRoutes = require("./routes/bookmarks/bookmarkRoutes");
//const exploreRoutes = require("./routes/explore/exploreRoutes");
const exploreRoutes = require("./routes/exploreRoutes");


dotenv.config();
const app = express();

const SERVER_PORT = process.env.SERVER_PORT || 8081;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : "*";

// ✅ Serve uploaded media files BEFORE route handlers
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const dbConnection = require("./config/db.config");

// Connect to DB then start server
dbConnection()
  .then(() => {
    console.log("✅ Connected to the database.");

    app.use(cors({ origin: ALLOWED_ORIGINS }));
    app.use(express.json());
    app.use(morgan("dev"));

    // ✅ Define routes here...
    app.use("/user", require("./routes/userLogin"));
    app.use("/user", require("./routes/userSignUp"));
    app.use("/posts", require("./routes/posts/createPost"));
    app.use("/posts", require("./routes/posts/getPost"));
    app.use("/bookmarks", bookmarkRoutes);
    app.use("/explore", exploreRoutes); // ✅ Explore route
  

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
    process.exit(1);
  });
