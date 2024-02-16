import React, { useState } from 'react';
import axios from 'axios';
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

const SigninCard = () => {
  const [username, setUsername] = useState("");
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const usernameRef = React.useRef();
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const passwordRef = React.useRef();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setUsernameInvalid("Username is required.");
      usernameRef.current.focus();
    } else if (!password) {
      setPasswordInvalid("Password is required.");
      passwordRef.current.focus();
    } else {
      setSigningIn(true);
      try {
        await axios.post('/api/login/', {
          username,
          password
        });
        window.location.pathname = '/';
      } catch (error) {
        if (error.response.status === 401) {
          setError('Could not find a user with that username and password.');
        } else {
          setError(error.message);
        }
      } finally {
        setSigningIn(false);
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign into Journal Jam
        </Typography>
        <Collapse sx={{ mt: 1 }} fullWidth in={error}>
          <Alert
            severity="error"
            fullWidth
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
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        </Collapse>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            name="username"
            value={username}
            inputRef={usernameRef}
            onChange={handleUsernameChange}
            error={usernameInvalid}
            helperText={usernameInvalid}
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={password}
            inputRef={passwordRef}
            onChange={handlePasswordChange}
            error={passwordInvalid}
            helperText={passwordInvalid}
          />
          <LoadingButton
            loading={signingIn}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Link href={`#`} variant="body">
              Forgot password?
            </Link>
          </Box>
          <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Link href={`/signup?un=${username}`} variant="body">
              Create an account
            </Link>
          </Box>
        </Box>
      </Box>
    </Container >
  );
}

export default SigninCard