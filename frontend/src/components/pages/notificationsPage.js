import React, { useEffect, useState } from "react";
import getUserInfo from "../../utilities/decodeJwt";
import { FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaUserCircle, FaEllipsisH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../css/base.css';
import '../../css/notificationsPage.css'; 

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchedUser = getUserInfo();
    if (!fetchedUser) return;
    setUser(fetchedUser);
    setNotifications([
      {
        _id: 1,
        message: "Your post received a new like!",
        time: "Just now",
      },
      {
        _id: 2,
        message: "You have a new follower.",
        time: "2h ago",
      },
    ]);
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

      <div className="notifications-container">
        <h1 className="notifications-title">
          <FaBell /> Notifications
        </h1>

        {user ? (
          notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((note) => (
                <div key={note._id} className="notification-card">
                  <div className="notification-content">
                    <FaUserCircle className="text-xl" />
                    <div>
                      <p className="notification-message">{note.message}</p>
                      <p className="notification-time">{note.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="notification-fallback">No notifications yet.</p>
          )
        ) : (
          <p className="notification-fallback">Please log in to see your notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;