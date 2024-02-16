import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getCsrfToken } from '../utils';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import './NavBar.css';

const NavBar = ({ theme, user, toggleTheme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modeText, setModeText] = useState(null);

  useEffect(() => {
    setModeText(
      `${window.localStorage.getItem('app-theme') === 'dark' ? 'Light' : 'Dark'} mode`);
  }, [theme]);

  const onSignOut = async (e) => {
    e.preventDefault();
    try {
      const csrftoken = getCsrfToken();
      await axios.post('/api/logout/', null, {
        headers: {
          'X-CSRFTOKEN': csrftoken,
        }
      });
      window.location.pathname = '/login';
    } catch (error) {
    }
  }

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar color="default" position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Journal Jam
        </Typography>
        <Typography sx={{ mr: 1 }} variant="body1">{user.username}</Typography>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={toggleTheme}>
            {modeText}
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>My Account</MenuItem>
          <MenuItem onClick={onSignOut}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar