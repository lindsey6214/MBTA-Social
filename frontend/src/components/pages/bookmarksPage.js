import React, { useState, useEffect } from "react";
import { 
  FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaEllipsisH 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import { useMemo } from "react";
import "../../css/bookmarksPage.css"; // Add your custom styles here
import "../../css/base.css";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const user = useMemo(() => getUserInfo(), []);

  useEffect(() => {
    console.log("User info:", user); // Check if user info is present

    if (!user) return;

    // Fetch bookmarked posts
    axios
      .get(`http://localhost:8081/bookmarks/${user.id}`)
      .then((res) => {
        console.log("Bookmarks response:", res.data); // Log the response data
        setBookmarks(res.data);
        setLoading(false); // Stop loading after fetching data
      })
      .catch((err) => {
        console.error("Error loading bookmarks:", err);
        setLoading(false); // Stop loading on error
      });
  }, [user]);

  const NavItem = ({ to, icon, label }) => (
    <Link to={to} className="nav-item">
      <div>{icon}</div>
      <span>{label}</span>
    </Link>
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
  
      {/* Main Content */}
      <div className="bookmarks-container">
        <h1 className="bookmarks-title">
          <FaBookmark /> Bookmarked Posts
        </h1>
  
        {loading ? (
          <p>Loading bookmarks...</p>
        ) : user ? (
          bookmarks.length > 0 ? (
            bookmarks.map((post) => (
              <div key={post._id} className="bookmark-card">
                <p className="bookmark-username">@{post.username}</p>
                <p className="bookmark-content">{post.content}</p>
                {post.mediaUris && (
                  post.mediaUris.endsWith(".mp4") ? (
                    <video controls className="bookmark-video">
                      <source
                        src={`http://localhost:8081${post.mediaUris}`}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      src={`http://localhost:8081${post.mediaUris}`}
                      alt="Post media"
                      className="bookmark-media"
                    />
                  )
                )}
              </div>
            ))
          ) : (
            <p className="no-bookmarks-message">You haven't bookmarked any posts yet.</p>
          )
        ) : (
          <p className="no-login-message">Please log in to view your bookmarks.</p>
        )}
      </div>
    </div>
  );
}
export default BookmarksPage;
