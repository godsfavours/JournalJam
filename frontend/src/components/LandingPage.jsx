import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Navigate } from "react-router-dom";
import SigninCard from "./SigninCard";
import SignupCard from "./SignupCard";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

const LandingPage = () => {
  let location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoaded(false);
      try {
        await axios.get("/api/current_user/");
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoaded(true);
      }
    };
    checkAuth();

    setShowLogin(location.pathname === "/login");
  }, [location]);

  if (!loaded) return null;

  return isAuth ? (
    <Navigate to="/" />
  ) : (
    <Grid
      sx={{ ml: 5, mr: 5, maxWidth: "100%", height: "100vh" }}
      container
      spacing={2}
    >
      <Grid alignItems="flex-end" xs={6}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h1">Journal Jam</Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat
            nemo blanditiis est doloremque illum suscipit praesentium optio
            error temporibus quidem, illo iste deserunt quis officiis
            consequuntur voluptatum, culpa qui maxime?
          </Typography>
        </Box>
      </Grid>
      <Grid xs={6}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ padding: "20px 0" }} elevation={1}>
            {showLogin ? <SigninCard /> : <SignupCard />}
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
