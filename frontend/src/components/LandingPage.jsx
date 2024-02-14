import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const LandingPage = () => {
  return (
    <Container>
      <Row className='vh-100'>
        <Col xs={7} className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-1">Journal Jam</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi consectetur corrupti, optio exercitationem excepturi incidunt harum repellendus aliquam ex quia vero quas quos tempore ab fugiat eaque cupiditate culpa sequi.</p>
        </Col>
        <Col className="d-flex align-items-center">
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginCard />} />
              <Route path="/signup" element={<SignupCard />} />
            </Routes>
          </BrowserRouter>
        </Col >
      </Row >

    </Container >
  )
}

export default LandingPage