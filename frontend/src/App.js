import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound';
import ProtectedRoutes from './components/ProtectedRoutes';
import EntriesPage from './components/EntriesPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const getTheme = () => {
  let appTheme = window.localStorage.getItem('app-theme');
  if (!appTheme) {
    const useDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');
    window.localStorage.setItem('app-theme', useDarkTheme ? 'dark' : 'light');
    return useDarkTheme ? darkTheme : lightTheme;
  }
  return appTheme === 'dark' ? darkTheme : lightTheme;
}

const App = () => {
  const [user, setUser] = useState({});
  const [theme, setTheme] = useState(getTheme());


  const onSetUser = (user) => {
    setUser(user);
  }

  const onToggleTheme = () => {
    const theme = window.localStorage.getItem('app-theme');
    window.localStorage.setItem('app-theme', theme === 'dark' ? 'light' : 'dark');
    setTheme(theme === 'dark' ? lightTheme : darkTheme);
  }

  const renderPaths = (paths, Element) =>
    paths.map((path) => <Route key={path} path={path} element={Element} />);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes setUser={onSetUser} />}>
            {
              renderPaths(["/", "/entries"],
              <EntriesPage
                user={user}
                toggleTheme={onToggleTheme}
                />)
            }
            {/* TODO: add routes here */}
          </Route>
          {
            renderPaths(["/login", "/signup"], <LandingPage />)
          }
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App