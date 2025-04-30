import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
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
import "../../css/feed.css";
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
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posted");
  const [likedPosts, setLikedPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      navigate("/login");
    } else {
      setUser(userInfo);
  
      const fetchUserPosts = async () => {
        try {
          const res = await fetch(`http://localhost:8081/posts/user/${userInfo._id}`);
          const data = await res.json();
          setUserPosts(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch user posts", err);
          setUserPosts([]);
        }
      };
  
      const fetchLikedPosts = async () => {
        try {
          const res = await fetch(`http://localhost:8081/posts/liked/${userInfo._id}`);
          const data = await res.json();
          setLikedPosts(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch liked posts", err);
        }
      };
  
      const fetchFollowedUsers = async () => {
        try {
          const res = await fetch(`http://localhost:8081/user/followed/${userInfo._id}`);
          const data = await res.json();
          setFollowedUsers(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch followed posts", err);
        }
      };
  
      fetchUserPosts();
      fetchLikedPosts();
      fetchFollowedUsers();
    }
  }, [navigate]);


  const handleSave = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setShowErrorModal(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/user/editUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, password }),
      });

      const data = await res.json();

      if (data.accessToken) {
        setUser({ ...user, accessToken: data.accessToken });
        setEditMode(false);
        setPassword("");
      } else {
        setError(data.message || "Failed to update password");
        setShowErrorModal(true);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      setShowErrorModal(true);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("profilePicture", file);

      fetch(`http://localhost:8081/user/uploadProfilePicture`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUser({ ...user, profilePicture: data.profilePictureUrl });
          } else {
            console.log("Failed to upload profile picture:", data.message);
          }
        })
        .catch((error) =>
          console.error("Error uploading profile picture:", error)
        );
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
              <Form.Group>
                <Form.Label>Upload Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleProfilePictureChange}
                />
              </Form.Group>
            </div>

            <div className="col-md-8">
              <h1>{user.username}</h1>
              <div>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>

                {editMode && (
                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                )}

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

          <div className="post-tabs">
            {["posted", "liked", "followed"].map((tab) => (
              <div
                key={tab}
                className={`tab-item ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>

          <div className="user-posts mt-4">
            {activeTab === "posted" && userPosts.length === 0 && (
              <h2>{user.username}'s Posted Posts</h2>
            )}
            {activeTab === "liked" && likedPosts.length === 0 && (
              <h2>{user.username}'s Liked Posts</h2>
            )}
            {activeTab === "followed" && followedUsers.length === 0 && (
              <h2>{user.username}'s Followed Users</h2>
            )}

            {(() => {
              const selectedPosts =
                activeTab === "posted" ? userPosts :
                activeTab === "liked" ? likedPosts :
                followedUsers;

              return selectedPosts.length === 0 ? (
                <p>Nothing found in this category.</p>
              ) : (
                selectedPosts.map((post) => (
                  <div key={post._id} className="post-card mb-3 p-3 shadow-sm border rounded">
                    <p>{post.content}</p>
                    <small className="text-muted">
                      {new Date(post.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))
              );
            })()}
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};


export default UserProfile;