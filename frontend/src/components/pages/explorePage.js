import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { 
  FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaEllipsisH 
} from 'react-icons/fa';
import '../../css/base.css';
import '../../css/explorePage.css';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get("http://localhost:8081/explore/nearby", {
              params: { lat: latitude, lon: longitude },
            });
            setPosts(res.data);
          } catch (err) {
            setError("Failed to load nearby posts.");
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
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
          <div key={post._id} className="post-card">
            <div className="username">@{post.username}</div>
            <p>{post.content}</p>
            {post.mediaUris &&
              (post.mediaUris.endsWith(".mp4") ? (
                <video controls>
                  <source src={`http://localhost:8081${post.mediaUris}`} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={`http://localhost:8081${post.mediaUris}`}
                  alt="Post media"
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
