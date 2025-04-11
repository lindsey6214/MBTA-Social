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
    <ReactNavbar className="navbar-custom">
      <Container>
        <Nav className="me-auto">
          {user ? (
            <>
              <Nav.Link
                  as="button"
                  className="nav-link btn-link"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Logout
                </Nav.Link>
              </>
                    ) : (
                      <>
                        <Nav.Link href="/login" className="nav-link">Login</Nav.Link>
                        <Nav.Link href="/signup" className="nav-link">Sign Up</Nav.Link>
                      </>
                    )}
              </Nav>

          <Nav className="ms-auto">
            {user ? (
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
            ) : null}
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