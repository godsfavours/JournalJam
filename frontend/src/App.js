import React from "react";
import {BrowserRouter, Route,Routes} from 'react-router-dom';
import { Link } from 'react-router';
import {Journal} from "./Journal";
import {Home} from "./Home";
import {variables} from './Variables.js';
import NavBar from './NavBar';
import routes from './routes';

function App() {
  return (
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
        Welcome to JournalJam
      </h3>

      <BrowserRouter>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
        </Routes>
      </div>
    </BrowserRouter>
  

      <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/journal_entries" element={<Journal />} />
      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App;