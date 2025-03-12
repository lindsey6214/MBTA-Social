import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    setBgColor(light ? "white" : SECONDARY_COLOR);
    setBgText(light ? "Dark Mode" : "Light Mode");
  }, [light]);

  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textDecoration: "none",
  };

  const backgroundStyling = { background: bgColor };

  const buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: bgColor,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      window.alert(
        `Registration successful! Your username is "${res.username}". Please log in.`
      );
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom vh-100">
        <div
          className="row d-flex justify-content-center align-items-center h-100"
          style={backgroundStyling}
        >
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label style={labelStyling}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={labelStyling}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  onChange={() => setLight(!light)}
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="flexSwitchCheckDefault"
                >
                  {bgText}
                </label>
              </div>

              {error && (
                <div style={labelStyling} className="pt-3">
                  {error}
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                style={buttonStyling}
                className="mt-2"
              >
                Register
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;