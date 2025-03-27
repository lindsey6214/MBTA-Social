import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/register`;

const Register = () => {
  const [data, setData] = useState({ email: "", password: "", birthday: "" });
  const [error, setError] = useState("");
  const [lightMode, setLightMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(url, { ...data, birthdate: data.birthday }); // Rename "birthday" to "birthdate"
      navigate("/login");
    } catch (error) {
      if (error.response?.status >= 400) {
        setError(error.response.data.message);
      }
    }
  };  

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center" style={{ background: lightMode ? "white" : SECONDARY_COLOR }}>
      <div className="col-md-6 col-lg-4 p-4 shadow-lg bg-white rounded">
        <h3 className="text-center" style={{ color: PRIMARY_COLOR }}>Sign Up</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>Email</Form.Label>
            <Form.Control type="email" name="email" onChange={handleChange} placeholder="Enter email" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>Password</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>Birthday</Form.Label>
            <Form.Control type="date" name="birthday" onChange={handleChange} required />
          </Form.Group>
          {error && <div className="text-danger text-center">{error}</div>}
          <Button type="submit" style={{ background: PRIMARY_COLOR, border: "none", width: "100%" }} className="mt-3">
            Sign Up
          </Button>
        </Form>
        <div className="text-center mt-3">
          <span className="text-muted">Already have an account?</span> 
          <Link to="/login" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}> Log in</Link>
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

export default Register;