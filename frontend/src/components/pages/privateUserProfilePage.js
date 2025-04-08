import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import getUserInfo from "../../utilities/decodeJwt";
import { Form } from "react-bootstrap"; // For form elements

const PrivateUserProfile = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false); // For toggling edit mode

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSave = () => {
    // Implement save logic (e.g., save updated user details to the backend)
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h4>Please log in to view this page.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4 text-center">
          {/* Profile Picture Section */}
          <img
            src={user.profilePicture || "default-profile.jpg"}
            alt="Profile"
            className="img-fluid rounded-circle mb-3"
            style={{ width: "150px", height: "150px" }}
          />
          <Button className="mt-2" variant="primary">
            Change Picture
          </Button>
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

              <Button variant="success" onClick={handleSave} className="mt-3">
                Save Changes
              </Button>
            </div>
          ) : (
            <div>
              <p><strong>Full Name:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Bio:</strong> {user.bio}</p>

              <Button variant="secondary" onClick={() => setEditMode(true)} className="mt-3">
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Log Out Button */}
      <Button className="mt-3" onClick={() => setShowLogoutModal(true)}>
        Log Out
      </Button>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Yes, Log Out
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrivateUserProfile;