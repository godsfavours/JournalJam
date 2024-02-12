import React from "react";
import {BrowserRouter, Route,Routes} from 'react-router-dom';
import {Journal} from "./Journal";
import {Home} from "./Home";

function App() {
  return (
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
        Welcome to JournalJam
      </h3>
      <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/journals" element={<Journal />} />
      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App;