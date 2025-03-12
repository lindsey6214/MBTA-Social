import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h4>Please log in to view this page.</h4>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h1>{user.username}</h1>
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