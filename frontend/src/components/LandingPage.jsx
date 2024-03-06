import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Navigate } from "react-router-dom";
import SigninCard from "./SigninCard";
import SignupCard from "./SignupCard";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

const APP_NAME = "Journal Jam";
const APP_DESC =
  "An AI-powered journaling platform to take your journaling experience to the next level.";

const LandingPage = () => {
  let location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDesc, setAppDesc] = useState("");

  useEffect(() => {
    const letters = APP_NAME.split("");

    const printLetters = async () => {
      for (let i = 0; i < letters.length; i++) {
        await new Promise((r) => setTimeout(r, 100));
        setAppName((prev) => prev + letters[i]);
      }
      await new Promise((r) => setTimeout(r, 500));
      setAppDesc(APP_DESC);
    };
    printLetters();
  }, []);

  useEffect(async () => {
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
    await checkAuth();

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
          <Typography variant="h1">{appName}</Typography>
          <Typography variant="body1">{appDesc}</Typography>
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
