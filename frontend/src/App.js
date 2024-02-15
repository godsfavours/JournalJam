import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios'
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound';

const App = () => {
  const renderPaths = (paths, Element) =>
    paths.map((path) => <Route key={path} path={path} element={Element} />);

  return (
    <BrowserRouter>
      <Routes>
        {renderPaths(["/login", "/signup"], <LandingPage />)}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App