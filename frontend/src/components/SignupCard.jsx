import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';

import '../App.css';

const SignupCard = () => {
  const [username, setUsername] = useState("");
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const usernameRef = React.useRef();
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState("");
  const emailRef = React.useRef();
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const passwordRef = React.useRef();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationInvalid, setPasswordConfirmationInvalid] = useState("");
  const passwordConfirmationRef = React.useRef();
  const [error, setError] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setUsername(searchParams.get("un"));
  }, []);

  const validateUsername = () => {
    let valid = true;
    if (!username) {
      setUsernameInvalid("Username is required.");
      valid = false;
    } else if (username.length > 150) {
      setUsernameInvalid("Username must be 150 characters or fewer.");
      valid = false;
    }

    if (!valid)
      usernameRef.current.focus();

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
      emailRef.current.focus();

    return valid;
  }

  const validatePassword = () => {
    let valid = true;

    if (!password) {
      setPasswordInvalid("Password is required.");
      valid = false;
    } else if (password.length < 8) {
      setPasswordInvalid("Password must contain at least 8 characters.");
      valid = false;
    }

    if (!valid)
      passwordRef.current.focus();

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
      passwordConfirmationRef.current.focus();

    return valid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername() || !validateEmail() || !validatePassword()
      || !validatePasswordConfirmation())
      return;

    setSigningUp(true);
    try {
      console.log('creating user...');
      await axios.post('/api/user/', {
        username,
        email,
        'password1': password,
        'password2': passwordConfirmation,
      });
      setSearchParams(undefined);
      window.location.pathname = '/';
    } catch (error) {
      // TODO: better informative error messages
      if (error.response.status === 400) {
        setError('One or more fields is invalid. Check that your username only contains letters, digits and the following characters: @/./+/-/_. Also make sure that your password is not entirely numeric, a commonly used password, or too similar to your other personal information. As a last resort, try a different username.');
      } else {
        setError(error.message);
      }
    } finally {
      setSigningUp(false);
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h2" variant="h5">
          Create a Journal Jam account
        </Typography>
        <Collapse sx={{ mt: 1 }} in={!!error}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError("");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Username*"
            name="username"
            value={username}
            inputRef={usernameRef}
            onChange={handleUsernameChange}
            error={!!usernameInvalid}
            helperText={usernameInvalid}
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email*"
            name="email"
            value={email}
            inputRef={emailRef}
            onChange={handleEmailChange}
            error={!!emailInvalid}
            helperText={emailInvalid}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password*"
            type="password"
            value={password}
            inputRef={passwordRef}
            onChange={handlePasswordChange}
            error={!!passwordInvalid}
            helperText={passwordInvalid}
          />
          <TextField
            margin="normal"
            fullWidth
            name="passwordConfirmation"
            label="Confirm Password*"
            type="password"
            value={passwordConfirmation}
            inputRef={passwordConfirmationRef}
            onChange={handlePasswordConfirmationChange}
            error={!!passwordConfirmationInvalid}
            helperText={passwordConfirmationInvalid}
          />
          <LoadingButton
            loading={signingUp}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 3 }}
          >
            Sign Up
          </LoadingButton>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <p>Already have an account? <Link href="\login">Sign in</Link></p>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default SignupCard