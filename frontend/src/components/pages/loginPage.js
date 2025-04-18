import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTrain } from "react-icons/fa";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#cc5c99";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      localStorage.removeItem("accessToken");
    }
    setUser(userInfo);
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleChange = ({ target: { name, value } }) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("accessToken", res.accessToken);
      navigate("/home");
    } catch (error) {
      if (error.response?.status >= 400) {
        setError(error.response.data.message);
        setShowErrorModal(true); // Show modal on error
      }
    }
  };

  return (
    <section className="main-container">
      {/* Left Side with Icon */}
      <div className="landing-left">
        <FaTrain className="train-icon" />
      </div>

      {/* Right Side with Form */}
      <div className="landing-right">
          <div className="landing-text-group">
        <h1 className="landing-heading">
          Welcome Back!
        </h1>
        <p className="landing-subtext">
          Sign in to access your account.
        </p>

        <div className="w-full max-w-sm space-y-4">
          {/* Login Form */}
          <Form onSubmit={handleSubmit} className="landing-right-form">
            <Form.Group className="mb-3">
              <Form.Label
                style={{ fontWeight: "bold", color: "white" }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    style={{ color: "black", backgroundColor: "white" }} // White background, black text
                  />
                </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label
                style={{ fontWeight: "bold", color: "white" }} // Make label text white
              >
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
                required
                style={{ color: "black", backgroundColor: "white" }} // White background, black text
              />
            </Form.Group>

            <Button
              type="submit"
              style={{
                background: PRIMARY_COLOR,
                border: "none",
                width: "100%",
              }}
              className="mt-3"
            >
              Log In
            </Button>
          </Form>

          {/* Sign-up Link */}
          <div className="text-center mt-3">
            <span className="text-white">Don't have an account? </span>
            <Link
              to="/signup"
              style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
            >
              {" "}
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Login;