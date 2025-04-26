import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaBell,
  FaEnvelope,
  FaHashtag,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/userProfilePage.css";
import "../../css/base.css";
import getUserInfo from "../../utilities/decodeJwt";

const NavItem = ({ to, icon, label }) => (
  <Link to={to} className="nav-item" style={{ textDecoration: "none" }}>
    <div>{icon}</div>
    <span>{label}</span>
  </Link>
);

const UserProfile = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState(""); // Local state for the password field
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      navigate("/login");
    } else {
      setUser(userInfo);

      // Fetch posts only after userInfo is available
      fetch(`http://localhost:8081/posts/user/${userInfo._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            console.log(data.message); // Handle no posts found scenario
          } else {
            setUserPosts(data); // Set user posts if they exist
          }
        })
        .catch((err) => console.error("Failed to fetch posts", err));
    }
  }, [navigate]);

  const handleSave = () => {
    // Handle password change here (you may want to send an API request to update the password)
    if (password) {
      fetch("http://localhost:8081/user/editUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          password: password, // Only update password
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.accessToken) {
            // You might want to update the user session or show a success message
            setUser({ ...user, accessToken: data.accessToken });
            setEditMode(false); // Exit edit mode
            setPassword(""); // Clear password input field
          } else {
            console.log("Failed to update password:", data);
          }
        })
        .catch((error) => console.error("Error saving password:", error));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file)); // Show preview of the image

      // Create form data for the image upload
      const formData = new FormData();
      formData.append("profilePicture", file);
      
      // Upload the image to the backend
      fetch(`http://localhost:8081/user/uploadProfilePicture`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Assuming you use token for auth
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update the user's profile with the new image URL
            setUser({ ...user, profilePicture: data.profilePictureUrl });
          } else {
            console.log("Failed to upload profile picture:", data.message);
          }
        })
        .catch((error) => console.error("Error uploading profile picture:", error));
    }
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

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center">
              <img
                src={user.profilePicture || "default-profile.jpg"}
                alt="Profile"
                className="profile-img"
              />
              {/* Profile picture upload input */}
              <Form.Group>
                <Form.Label>Upload Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleProfilePictureChange} // Handle file change
                />
              </Form.Group>
            </div>

            <div className="col-md-8">
              <h1>{user.username}</h1>
              <div>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>

                {editMode ? (
                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // Update password
                    />
                  </Form.Group>
                ) : null}

                {editMode ? (
                  <button onClick={handleSave} className="save-button">
                    Save Changes
                  </button>
                ) : (
                  <button onClick={() => setEditMode(true)} className="edit-button">
                    Edit Password
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User Posts Section */}
          <div className="user-posts mt-4">
            <h2>{user.username}'s Posts</h2>
            {userPosts.length === 0 ? (
              <p>This user hasn't posted anything yet.</p>
            ) : (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="post-card mb-3 p-3 shadow-sm border rounded"
                >
                  <p>{post.content}</p>
                  <small className="text-muted">
                    {new Date(post.timestamp).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;