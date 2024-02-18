import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound';
import ProtectedRoutes from './components/ProtectedRoutes';
import EntriesPage from './components/EntriesPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './styles/themes';

const getTheme = () => {
  let appTheme = window.localStorage.getItem('app-theme');
  if (!appTheme) {
    appTheme = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    window.localStorage.setItem('app-theme', appTheme);
  }
  return appTheme;
}

const App = () => {
  const [user, setUser] = useState({});
  const [theme, setTheme] = useState(getTheme());


  const onSetUser = (user) => {
    setUser(user);
  }

  const onToggleTheme = () => {
    const newTheme =
      window.localStorage.getItem('app-theme') === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('app-theme', newTheme);
    setTheme(newTheme);
  }

  const renderPaths = (paths, Element) =>
    paths.map((path) => <Route key={path} path={path} element={Element} />);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes setUser={onSetUser} />}>
            {
              renderPaths(["/", "/entries"],
              <EntriesPage
                user={user}
                theme={theme}
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