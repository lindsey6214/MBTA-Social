import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <ReactNavbar bg="dark" variant="dark">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Start</Nav.Link>
          <Nav.Link href="/home">Home</Nav.Link>
          {user ? (
            <>
              <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Signup</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </ReactNavbar>
  );
}