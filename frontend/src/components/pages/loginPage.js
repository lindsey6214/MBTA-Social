import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [lightMode, setLightMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUserInfo());
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
      }
    }
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center" style={{ background: lightMode ? "white" : SECONDARY_COLOR }}>
      <div className="col-md-6 col-lg-4 p-4 shadow-lg bg-white rounded">
        <h3 className="text-center" style={{ color: PRIMARY_COLOR }}>Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>Username</Form.Label>
            <Form.Control type="text" name="username" onChange={handleChange} placeholder="Enter username" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>Password</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} placeholder="Password" required />
          </Form.Group>
          {error && <div className="text-danger text-center">{error}</div>}
          <Button type="submit" style={{ background: PRIMARY_COLOR, border: "none", width: "100%" }} className="mt-3">
            Log In
          </Button>
        </Form>
        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account?</span> 
          <Link to="/signup" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}> Sign up</Link>
        </div>
        <div className="form-check form-switch mt-3 text-center">
          <input className="form-check-input" type="checkbox" id="themeSwitch" onChange={() => setLightMode(!lightMode)} />
          <label className="form-check-label text-muted" htmlFor="themeSwitch">
            {lightMode ? "Dark Mode" : "Light Mode"}
          </label>
        </div>
      </div>
    </section>
  );
};

export default Login;