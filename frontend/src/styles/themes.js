import { ThemeProvider, createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    // primary: { TODO: change to app color
    //   main: "#2d632f",
    // },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    // primary: {
    //   main: "#2d632f",
    // },
  },
});
