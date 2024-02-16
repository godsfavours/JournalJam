import axios from 'axios';
import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

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
  const [signingIn, setSigningIn] = useState(false);

  const validateUsername = () => {
    let valid = true;
    if (!username) {
      setUsernameInvalid("Username is required.");
      valid = false;
    }

    if (!valid)
      document.getElementById("usernameInput").focus();

    return valid;
  }

  const validateEmail = () => {
    let valid = true;

    if (!email) {
      setEmailInvalid("Email is required.");
      valid = false;
    } else if (!email.toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
      setEmailInvalid("Please enter a valid email.");
      valid = false;
    }

    if (!valid)
      document.getElementById("emailInput").focus();

    return valid;
  }

  const validatePassword = () => {
    let valid = true;

    if (!password) {
      setPasswordInvalid("Password is required.");
      valid = false;
    }


    if (!valid)
      document.getElementById("passwordInput").focus();

    return valid;
  }

  const validatePasswordConfirmation = () => {
    let valid = true;

    if (!passwordConfirmation) {
      setPasswordConfirmationInvalid("Please confirm your password.");
      valid = false;
    } else if (password !== passwordConfirmation) {
      setPasswordConfirmationInvalid("Password does not match.");
      valid = false;
    }

    if (!valid)
      document.getElementById("passwordConfirmInput").focus();

    return valid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername() || !validateEmail() || !validatePassword()
      || !validatePasswordConfirmation())
      return;

    setSigningIn(true);
    try {
      console.log('creating user...');
      const res = await axios.post('/api/user/', {
        username,
        email,
        'password1': password,
        'password2': passwordConfirmation,
      });
      window.location.pathname = '/';
    } catch (error) {
      // TODO: better informative error messages
      if (error.response.status === 400) {
        setError('Username is taken. Please try a different username.');
        setUsernameInvalid('Username unavailable.');
      } else {
        console.log(error)
        setError(error.message);
      }
    } finally {
      setSigningIn(false);
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
          {
            signingIn ?
              <Spinner animation="border" role="status" size="sm" /> :
              <>Sign up</>
          }
        </Button>
        <p className='mt-3 text-center'>Already have an account? <a href="/login">Log in</a></p>
      </Form>
    </Card>
  );
}

export default SignupCard