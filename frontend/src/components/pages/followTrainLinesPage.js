import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaHome, FaUser, FaBell, FaEnvelope,
  FaHashtag, FaBookmark, FaEllipsisH, FaTrain
} from "react-icons/fa";
import "../../css/base.css";

const FollowTrainLinesPage = () => {
  const [trainLines, setTrainLines] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user._id);

      axios
        .get(`http://localhost:8081/trainlines?userId=${user._id}`)
        .then((res) => setTrainLines(res.data))
        .catch((err) => console.error("Error fetching train lines:", err));
    }
  }, []);

  const handleFollow = async (mbtaId) => {
    try {
      await axios.post(`http://localhost:8081/following/line/${mbtaId}`, {
        userId,
      });
      setTrainLines((prev) =>
        prev.map((line) =>
          line.mbtaId === mbtaId ? { ...line, followed: true } : line
        )
      );
    } catch (error) {
      console.error("Error following line:", error);
    }
  };

  const handleUnfollow = async (mbtaId) => {
    try {
      await axios.post(`http://localhost:8081/following/unfollow/line/${mbtaId}`, {
        userId,
      });
      setTrainLines((prev) =>
        prev.map((line) =>
          line.mbtaId === mbtaId ? { ...line, followed: false } : line
        )
      );
    } catch (error) {
      console.error("Error unfollowing line:", error);
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
          <NavItem to="/trainlines" icon={<FaTrain />} label="Train Lines" />
          <NavItem to="/more" icon={<FaEllipsisH />} label="More" />
        </div>
      </div>

      {/* Main Content */}
      <div className="feed-container">
        <h1 className="text-2xl font-bold mb-4 text-white">🚇 Follow Train Lines</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {trainLines.map((line) => (
            <div
              key={line.mbtaId}
              className="bg-white/20 backdrop-blur p-4 rounded-lg text-white shadow"
            >
              <h2 className="text-lg font-semibold">{line.name}</h2>
              <p className="text-sm text-gray-200 capitalize">Type: {line.type}</p>
              <div className="mt-4">
                {line.followed ? (
                  <button
                    onClick={() => handleUnfollow(line.mbtaId)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(line.mbtaId)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowTrainLinesPage;
