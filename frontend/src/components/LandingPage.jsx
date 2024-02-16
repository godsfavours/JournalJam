import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios'
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const LandingPage = () => {
  let location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoaded(false);
      try {
        const res = await axios.get('/api/current_user/');
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoaded(true);
      }
    };
    checkAuth();

    setShowLogin(location.pathname === '/login');
    console.log(location);
  }, [location]);

  if (!loaded) return null;

  return isAuth ? <Navigate to="/" /> : (
    <Container>
      <Row className='vh-100'>
        <Col xs={7} className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-1">Journal Jam</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi consectetur corrupti, optio exercitationem excepturi incidunt harum repellendus aliquam ex quia vero quas quos tempore ab fugiat eaque cupiditate culpa sequi.</p>
        </Col>
        <Col className="d-flex align-items-center">
          {
            showLogin ? <LoginCard /> : <SignupCard />
          }
        </Col >
      </Row >

    </Container >
  )
}

export default LandingPage