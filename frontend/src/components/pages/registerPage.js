import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FaTrain } from "react-icons/fa";
import "../../css/landingLoginRegister.css";

const PRIMARY_COLOR = "#cc5c99";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  const [data, setData] = useState({ email: "", password: "", birthday: "" });
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(url, { ...data, birthdate: data.birthday }); // Map birthday to birthdate for backend
      navigate("/login");
    } catch (error) {
      if (error.response?.status >= 400) {
        setError(error.response.data.message);
        setShowErrorModal(true); // Show error modal
      }
    }
  };

  return (
    <section className="landing-container">
      {/* Left Side with Icon */}
      <div className="landing-left">
        <FaTrain className="train-icon" />
      </div>

      {/* Right Side with Form */}
      <div className="landing-right">
      <div className="landing-text-group">
        <h1 className="landing-heading">Sign Up</h1>
        <p className="landing-subtext">Create your account to get started.</p>


          {/* Registration Form */}
          <Form onSubmit={handleSubmit} className="landing-right-form">
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold", color: "white" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  className="form-control"
                  style={{ color: "black", backgroundColor: "white" }} // White background, black text
                />
              </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold", color: "white" }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="form-control"
                  style={{ color: "black", backgroundColor: "white" }} // White background, black text
                />
              </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold", color: "white" }}>Birthday</Form.Label>
                <Form.Control
                  type="date"
                  name="birthday"
                  onChange={handleChange}
                  required
                  className="form-control"
                  style={{ color: "black", backgroundColor: "white" }} // White background, black text
                />
              </Form.Group>

            <Button
              className="auth-button">Sign Up</Button>
          </Form>

          {/* Login Link */}
          <div className="text-center mt-3">
            <span className="text-white">Already have an account? </span>
            <Link to="/login" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
              Log in
            </Link>
          </div>
        </div>
      </div>


      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Error</Modal.Title>
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

export default Register;