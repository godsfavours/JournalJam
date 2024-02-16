import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound';
import ProtectedRoutes from './components/ProtectedRoutes';
import EntriesPage from './components/EntriesPage';

const App = () => {
  const [user, setUser] = useState({});

  const onSetUser = (user) => {
    setUser(user);
  }

  const renderPaths = (paths, Element) =>
    paths.map((path) => <Route key={path} path={path} element={Element} />);

  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route element={<ProtectedRoutes setUser={onSetUser} />}>
            {
              renderPaths(["/", "/entries"],
              <EntriesPage
                user={user}
                />)
            }
            {/* TODO: add routes here */}
          </Route>
          {
            renderPaths(["/login", "/signup"], <LandingPage />)
          }
          <Route path="*" element={<NotFound />}
        />
      </Routes>
      </BrowserRouter>
    </>


  )
}

export default App