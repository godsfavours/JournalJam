import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import '../App.css';

const LoginCard = () => {
  const [username, setUsername] = useState("");
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setUsernameInvalid("Username is required.");
      document.getElementById("usernameInput").focus();
    } else if (!password) {
      setPasswordInvalid("Password is required.");
      document.getElementById("passwordInput").focus();
    } else {
      try {
        const res = await axios.post('/api/login/', {
          username,
          password
        });
        window.location.pathname = '/';
      } catch (error) {
        setError(error.message);
      }
    }
  }

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setUsernameInvalid("");
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordInvalid("");
    setPassword(e.target.value);
  }

  return (
    <>
      <Card className="p-4 w-25r">
        <Form onSubmit={handleSubmit}>
          <h4 className='mb-3'>Sign into Journal Jam</h4>
          {
            error &&
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          }
          <Form.Group className="mb-3" controlId="usernameInput">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              isInvalid={usernameInvalid}
              value={username}
              onChange={handleUsernameChange}
            />
            <Form.Control.Feedback type="invalid">
              {usernameInvalid}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="passwordInput">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              isInvalid={passwordInvalid}
              value={password}
              onChange={handlePasswordChange}
            />
            <Form.Control.Feedback type="invalid">
              {passwordInvalid}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="rememberInput">
            <Form.Check
              type="checkbox"
              label="Remember me"
              defaultChecked={remember}
              onChange={() => setRemember(!remember)}
            />
          </Form.Group>
          <Button className="w-100" variant="primary" type="submit">
            Sign in
          </Button>
          <p className='mt-3 text-center'><a href="/signup">Create an account</a></p>
        </Form>
      </Card>
    </>
  );
}

export default LoginCard