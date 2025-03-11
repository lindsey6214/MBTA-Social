import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';

const EditUserPage = () => {
  const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/editUser`;
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [form, setValues] = useState({
    userId: "",
    username: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    setValues(prevState => ({
      ...prevState,
      userId: getUserInfo().id
    }));
  }, []);

  const findFormErrors = () => {
    const { username, email, password } = form;
    const newErrors = {};

    if (!username || username.trim() === '') newErrors.username = 'Input a valid username';
    else if (username.length < 6) newErrors.username = 'Username must be at least 6 characters';

    if (!email || email.trim() === '') newErrors.email = 'Input a valid email address';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Input a valid email address';

    if (!password || password.trim() === '') newErrors.password = 'Input a valid password';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    return newErrors;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setValues(prevState => ({
      ...prevState,
      [id]: value
    }));

    if (errors[id]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [id]: null
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const { data: res } = await axios.post(url, form);
        localStorage.setItem("accessToken", res.accessToken);
        navigate("/privateuserprofile");
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 409) {
            setErrors({ username: "Username is taken, pick another" });
          } else if (status >= 400 && status <= 500) {
            window.alert(data.message);
          }
        }
      }
    }
  };

  const handleCancel = () => {
    navigate("/privateuserprofile");
  };

  return (
    <div className="d-flex justify-content-center">
      <Card body className="mx-1 my-2" style={{ width: '30rem' }}>
        <Card.Title className="text-center">Edit User Information</Card.Title>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new username"
                id="username"
                value={form.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new email address"
                id="email"
                value={form.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                id="password"
                value={form.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
              <Col>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditUserPage;