import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = () => {
  const [username, setUsername] = useState("");
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username) {
      setUsernameInvalid("Username is required.");
      document.getElementById("usernameInput").focus();
    } else if (!password) {
      setPasswordInvalid("Password is required.");
      document.getElementById("passwordInput").focus();
    } else {
      console.log('logging in...');
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
    <div className='d-flex align-items-center justify-content-center 100-w vh-100 bg-light'>
      <div className='p-3 w-25 rounded bg-white'>
        {error && <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>}
        <Form onSubmit={handleSubmit}>
          <h4 className='mb-3'>Sign into Journal Jam</h4>
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
          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </Form>
      </div>
    </div >
  );
}

export default Login