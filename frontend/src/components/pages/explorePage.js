import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaEnvelope,
  FaHashtag,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import getUserInfo from "../../utilities/decodeJwt";
import Navbar from "./navbar";
import "../../css/base.css";
import "../../css/explorePage.css";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUserInfo();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const res = await axios.get("http://localhost:8081/explore/nearby", {
                params: { lat: latitude, lon: longitude },
              });
              setPosts(res.data);
              fetchCommentCounts(res.data);
              setLoading(false);
            },
            () => {
              setError("Location access denied.");
              setLoading(false);
            }
          );
        } else {
          const res = await axios.get("http://localhost:8081/posts/");
          setPosts(res.data);
          fetchCommentCounts(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
        setLoading(false);
      }
    };

    const fetchCommentCounts = (posts) => {
      posts.forEach((post) => {
        axios
          .get(`http://localhost:8081/comments/post/${post._id}`)
          .then((res) => {
            setCommentCounts((prev) => ({
              ...prev,
              [post._id]: res.data.length,
            }));
          })
          .catch((err) => console.error("Error fetching comments for post:", post._id, err));
      });
    };

    fetchPosts();

    axios
      .get("http://localhost:8081/user/getAll")
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleFollowRequest = async (targetUserId) => {
    try {
      await axios.post(`http://localhost:8081/following/follow/request/${targetUserId}`, {
        currentUserId: user._id,
      });
      alert("Follow request sent!");
    } catch (error) {
      console.error("Error sending follow request:", error);
      const msg = error?.response?.data?.message || "Failed to send follow request";
      alert("you have aready sent a request to follow this person");  // 🛠️ Show the actual backend message
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrainLines = posts.filter((post) =>
    post.trainLineName && post.trainLineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="nav-list">
          <Link to="/home" className="nav-item"><FaHome /> Home</Link>
          <Link to="/explore" className="nav-item"><FaHashtag /> Explore</Link>
          <Link to="/notifications" className="nav-item"><FaBell /> Notifications</Link>
          <Link to="/messages" className="nav-item"><FaEnvelope /> Messages</Link>
          <Link to="/bookmarks" className="nav-item"><FaBookmark /> Bookmarks</Link>
          <Link to="/profile" className="nav-item"><FaUser /> Profile</Link>
          <Link to="/more" className="nav-item"><FaEllipsisH /> More</Link>
        </div>
      </div>

      <div className="explore-container">
        <div className="search-bar-floating">
          <input
            type="text"
            className="search-input"
            placeholder="Search posts, users, or train lines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-buttons">
            <button onClick={() => setSearchFilter("posts")}>Posts</button>
            <button onClick={() => setSearchFilter("trainlines")}>Train Lines</button>
          </div>
        </div>

        {loading && <p className="loading-text">Loading nearby posts...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* User Suggestions */}
        {allUsers
          .filter((u) => u.username.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((u) => (
            <div key={u._id} className="user-card">
              @{u.username}
              <button
                onClick={() => handleFollowRequest(u._id)}
                className="follow-request-button"
              >
                Request to Follow
              </button>
            </div>
          ))}

        {/* Posts or Train Lines */}
        {(searchFilter === "posts" ? filteredPosts : filteredTrainLines).map((post) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="post-card">
              <div className="username">@{post.username}</div>
              <p>{post.content}</p>

              {post.mediaUris && post.mediaUris.length > 0 &&
                (post.mediaUris[0].endsWith(".mp4") ? (
                  <video controls>
                    <source src={`http://localhost:8081${post.mediaUris[0]}`} type="video/mp4" />
                  </video>
                ) : (
                  <img src={`http://localhost:8081${post.mediaUris[0]}`} alt="Post media" />
                ))}

              <p className="post-timestamp">{formatTimestamp(post.timestamp)}</p>
              <button className="comment-count-button">
                💬 {commentCounts[post._id] ?? 0} Comments
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;