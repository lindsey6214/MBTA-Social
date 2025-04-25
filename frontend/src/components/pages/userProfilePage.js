import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import getUserInfo from "../../utilities/decodeJwt";
import { Form } from "react-bootstrap"; // For form elements
import { FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaUserCircle, FaEllipsisH } from 'react-icons/fa';
import { Link } from "react-router-dom";
import '../../css/userProfilePage.css';
import '../../css/base.css';

const NavItem = ({ to, icon, label }) => (
  <Link to={to} className="nav-item" style={{textDecoration: "none"}}>
    <div>{icon}</div>
    <span>{label}</span>
  </Link>
);

const UserProfile = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false); // For toggling edit mode

  useEffect(() => {
    const userInfo = getUserInfo();
  if (!userInfo) {
    navigate("/login"); // Redirect if not authenticated
  } else {
    setUser(userInfo);
  }
}, [navigate]);

  const handleSave = () => {
    // Implement save logic (e.g., save updated user details to the backend)
    setEditMode(false);
  };

  if (!user) return <div>Loading...</div>;


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

  <div className="main-content">
    <div className="container">
      <div className="row">
        <div className="col-md-4 text-center">
          {/* Profile Picture Section */}
          <img
            src={user.profilePicture || "default-profile.jpg"}
            alt="Profile"
            className="profile-img"
          />
        </div>

        <div className="col-md-8">
          {/* User Info Section */}
          <h1>{user.username}</h1>
          {editMode ? (
            <div>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" defaultValue={user.fullName} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" defaultValue={user.email} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" defaultValue={user.bio} />
              </Form.Group>

              <button onClick={handleSave} className="save-button">
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              <p><strong>Full Name:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Bio:</strong> {user.bio}</p>

              <button onClick={() => setEditMode(true)} className="edit-button">
                    Edit Profile
                  </button>
                </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default UserProfile;