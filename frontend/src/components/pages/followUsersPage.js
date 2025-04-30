import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaHome, FaUser, FaBell, FaEnvelope,
  FaHashtag, FaBookmark, FaEllipsisH
} from "react-icons/fa";
import "../../css/base.css";

const FollowUsersPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user._id);
    }

    axios
      .get("http://localhost:8081/user/getAll")
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleFollowRequest = async (targetUserId) => {
    try {
      await axios.post(`http://localhost:8081/following/follow/request/${targetUserId}`, {
        currentUserId: userId,
      });
      alert("Follow request sent!");
    } catch (error) {
      console.error("Error sending follow request:", error);
      alert("Unable to send follow request");
    }
  };

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
      <div className="feed-container">
        <h1 className="text-2xl font-bold mb-4 text-white">🔍 Follow Users</h1>

        <input
          type="text"
          className="search-input mb-4"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          {allUsers
            .filter((u) => u.username.toLowerCase().includes(searchTerm.toLowerCase()) && u._id !== userId)
            .map((u) => (
              <div
                key={u._id}
                className="bg-white/20 backdrop-blur p-4 rounded-lg text-white shadow"
              >
                <h2 className="text-lg font-semibold">@{u.username}</h2>
                <div className="mt-4">
                  <button
                    onClick={() => handleFollowRequest(u._id)}
                    className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
                  >
                    Request to Follow
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FollowUsersPage;
