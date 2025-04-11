import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaUserCircle } from "react-icons/fa";
import "../css/base.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <ReactNavbar className="navbar-custom" expand="lg">
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Left section: login/signup or logout */}
          <Nav className="flex-grow-1">
            {!user ? (
              <>
                <Nav.Link href="/login" className="nav-link">Login</Nav.Link>
                <Nav.Link href="/signup" className="nav-link">Sign Up</Nav.Link>
              </>
            ) : (
              <Nav.Link
                as="button"
                className="nav-link btn-link"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </Nav.Link>
            )}
          </Nav>

          {/* Center section: App name */}
          <div className="text-center flex-grow-1">
            <ReactNavbar.Brand href="/" className="mx-auto fw-bold text-black fs-4">
              MyApp
            </ReactNavbar.Brand>
          </div>

          {/* Right section: profile image */}
          <Nav className="flex-grow-1 justify-content-end">
            {user && (
              <Nav.Link href="/profile" className="nav-link d-flex align-items-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "30px", height: "30px", objectFit: "cover" }}
                  />
                ) : (
                  <FaUserCircle size={28} />
                )}
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </ReactNavbar>

        <Modal 
        show={showLogoutModal} 
        onHide={() => setShowLogoutModal(false)} 
        backdrop="static" 
        keyboard={false}>
          
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
      </>
    );
}