import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";
import "../css/card.css";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <ReactNavbar style={{ backgroundColor: "white" }} className="navbar-custom">
      <Container>
        <Nav className="me-auto">
          <Nav.Link
            href="/"
            style={{ color: "#6b46c1", fontWeight: "bold" }} // Purple color
            onMouseEnter={(e) => (e.target.style.color = "#9f7aea")} // Lighter purple on hover
            onMouseLeave={(e) => (e.target.style.color = "#6b46c1")} // Return to purple color
          >
            Start
          </Nav.Link>
          <Nav.Link
            href="/home"
            style={{ color: "#6b46c1", fontWeight: "bold" }}
            onMouseEnter={(e) => (e.target.style.color = "#9f7aea")}
            onMouseLeave={(e) => (e.target.style.color = "#6b46c1")}
          >
            Home
          </Nav.Link>
          {user ? (
            <>
              <Nav.Link
                href="/privateUserProfile"
                style={{ color: "#6b46c1", fontWeight: "bold" }}
                onMouseEnter={(e) => (e.target.style.color = "#9f7aea")}
                onMouseLeave={(e) => (e.target.style.color = "#6b46c1")}
              >
                Profile
              </Nav.Link>
              <Nav.Link
                href="/logout"
                style={{ color: "#6b46c1", fontWeight: "bold" }}
                onMouseEnter={(e) => (e.target.style.color = "#9f7aea")}
                onMouseLeave={(e) => (e.target.style.color = "#6b46c1")}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                href="/login"
                style={{ color: "#6b46c1", fontWeight: "bold" }}
                onMouseEnter={(e) => (e.target.style.color = "#9f7aea")}
                onMouseLeave={(e) => (e.target.style.color = "#6b46c1")}
              >
                Login
              </Nav.Link>
              <Nav.Link
                href="/signup"
                style={{ color: "#6b46c1", fontWeight: "bold" }}
                onMouseEnter={(e) => (e.target.style.color = "#9f7aea")}
                onMouseLeave={(e) => (e.target.style.color = "#6b46c1")}
              >
                Sign Up
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </ReactNavbar>
  );
}