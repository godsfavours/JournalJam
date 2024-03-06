import axios from "axios";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";

const NavBar = ({ theme, user, toggleTheme, onNewEntry }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modeText, setModeText] = useState(null);

  useEffect(() => {
    setModeText(`${theme === "dark" ? "Light" : "Dark"} mode`);
  }, [theme]);

  const onSignOut = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/logout/", null, {
        headers: {
          "X-CSRFTOKEN": Cookies.get("csrftoken"),
        },
      });
      window.location.pathname = "/login";
    } catch (error) {}
  };

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      color="default"
      position="static"
      style={{
        backgroundColor: theme === "dark" ? "" : "white",
        // borderBottom: theme === 'light' ? '2px solid lightgrey' : '',
      }}
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Journal Jam
        </Typography>
        <Button variant="outlined" onClick={onNewEntry}>
          New Entry
        </Button>
        <IconButton
          size="large"
          aria-label="Nav Bar Actions"
          aria-controls="menu-navbar"
          aria-haspopup="true"
          onClick={handleOpenMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-navbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={toggleTheme}>{modeText}</MenuItem>
          <MenuItem onClick={handleCloseMenu}>My Account</MenuItem>
          <MenuItem onClick={onSignOut}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
