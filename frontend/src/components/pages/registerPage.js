import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FaTrain } from "react-icons/fa";

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
    <section className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white">
      {/* Left Side with Icon */}
      <div className="md:w-1/2 flex justify-center items-center">
        <FaTrain className="text-[200px] drop-shadow-2xl" />
      </div>

      {/* Right Side with Form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center text-center px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Sign Up</h1>
        <p className="text-lg md:text-xl font-medium mb-8">Create your account to get started.</p>

        <div className="w-full max-w-sm space-y-4">
          {/* Registration Form */}
          <Form onSubmit={handleSubmit} className="space-y-4">
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold", color: "white" }}>
                Email
              </Form.Label>
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
              <Form.Label style={{ fontWeight: "bold", color: "white" }}>
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

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold", color: "white" }}>
                Birthday
              </Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                onChange={handleChange}
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
              Sign Up
            </Button>
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