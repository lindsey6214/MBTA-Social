import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaEllipsisH } from 'react-icons/fa';
import '../../css/base.css';
import '../../css/explorePage.css';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              res = await axios.get("http://localhost:8081/explore/nearby", {
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
          res = await axios.get('http://localhost:8081/posts/');
          setPosts(res.data);
          fetchCommentCounts(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError("Failed to load posts.");
        setLoading(false);
      }
    };

    const fetchCommentCounts = (posts) => {
      posts.forEach(post => {
        axios.get(`http://localhost:8081/comments/post/${post._id}`)
          .then(res => {
            setCommentCounts(prev => ({
              ...prev,
              [post._id]: res.data.length
            }));
          })
          .catch(err => console.error('Error fetching comments for post:', post._id, err));
      });
    };

    fetchPosts();
  }, []);

  const NavItem = ({ to, icon, label }) => (
    <Link to={to} className="nav-item">
      <div>{icon}</div>
      <span>{label}</span>
    </Link>
  );

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="nav-list">
          <NavItem to="/home" icon={<FaHome />} label="Home" />
          <NavItem to="/explore" icon={<FaHashtag />} label="Explore" />
          <NavItem to="/notifications" icon={<FaBell />} label="Notifications" />
          <NavItem to="/messages" icon={<FaEnvelope />} label="Messages" />
          <NavItem to="/bookmarks" icon={<FaBookmark />} label="Bookmarks" />
          <NavItem to="/profile" icon={<FaUser />} label="Profile" />
          <NavItem to="/more" icon={<FaEllipsisH />} label="More" />
        </div>
      </div>

      {/* Explore Content */}
      <div className="explore-container">
        <h1 className="explore-title">Explore Nearby Posts</h1>

        <div className="flex gap-4 mb-4">
          <Link to="/trainlines" className="bg-purple-700 px-4 py-2 rounded text-white hover:bg-purple-800">
            Follow Train Lines
          </Link>
          <Link to="/followusers" className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">
            Follow Users
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search posts..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading && <p className="loading-text">Loading nearby posts...</p>}
        {error && <p className="error-message">{error}</p>}

        {filteredPosts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="post-card">
              <div className="username">@{post.username}</div>
              <p>{post.content}</p>

              {post.mediaUris && post.mediaUris.length > 0 && (
                post.mediaUris[0].endsWith(".mp4") ? (
                  <video controls>
                    <source src={`http://localhost:8081${post.mediaUris[0]}`} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={`http://localhost:8081${post.mediaUris[0]}`}
                    alt="Post media"
                  />
                )
              )}

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
