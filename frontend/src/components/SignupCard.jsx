import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../App.css';

const SignupCard = () => {
  const [username, setUsername] = useState("");
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationInvalid, setPasswordConfirmationInvalid] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username) {
      setUsernameInvalid("Username is required.");
      document.getElementById("usernameInput").focus();
    } else if (!email) {
      setEmailInvalid("Email is required.");
      document.getElementById("emailInput").focus();
    } else if (!password) {
      setPasswordInvalid("Password is required.");
      document.getElementById("passwordInput").focus();
    } else if (!passwordConfirmation) {
      setPasswordConfirmationInvalid("Please confirm your password.");
      document.getElementById("passwordConfirmInput").focus();
    } else if (password !== passwordConfirmation) {
      setPasswordConfirmationInvalid("Password does not match.");
      document.getElementById("passwordConfirmInput").focus();
    } else {
      console.log('signing up...');
    }
  }

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setUsernameInvalid("");
    setUsername(e.target.value);
  }

  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmailInvalid("");
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordInvalid("");
    setPasswordConfirmationInvalid("");
    setPassword(e.target.value);
  }

  const handlePasswordConfirmationChange = (e) => {
    e.preventDefault();
    setPasswordConfirmationInvalid("");
    setPasswordConfirmation(e.target.value);
  }

  return (
    <Card className="p-4 w-25r">
      <Form onSubmit={handleSubmit}>
        <h4 className='mb-3'>Create a Journal Jam account</h4>
        {
          error &&
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        }
        <Form.Group className="mb-3" controlId="usernameInput">
          <Form.Label>Username*</Form.Label>
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
        <Form.Group className="mb-3" controlId="emailInput">
          <Form.Label>Email*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            isInvalid={emailInvalid}
            value={email}
            onChange={handleEmailChange}
          />
          <Form.Control.Feedback type="invalid">
            {emailInvalid}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="passwordInput">
          <Form.Label>Password*</Form.Label>
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
        <Form.Group className="mb-3" controlId="passwordConfirmInput">
          <Form.Label>Confirm Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            isInvalid={passwordConfirmationInvalid}
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
          />
          <Form.Control.Feedback type="invalid">
            {passwordConfirmationInvalid}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          className='w-100'
          variant="primary"
          type="submit">
          Sign up
        </Button>
        <p className='mt-3 text-center'>Already have an account? <a href="/login">Log in</a></p>
      </Form>
    </Card>
  );
}

export default SignupCard