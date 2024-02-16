import axios from 'axios';
import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import './NavBar.css';
import { getCsrfToken } from '../utils';

const NavBar = ({ user }) => {
  const [signingOut, setSigningOut] = useState(false);

  const onSignOut = async (e) => {
    e.preventDefault();
    setSigningOut(true);
    try {
      const csrftoken = getCsrfToken();
      await axios.post('/api/logout/', null, {
        headers: {
          'X-CSRFTOKEN': csrftoken,
        }
      });
      window.location.pathname = '/login';
    } catch (error) {
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="/">Journal Jam</Navbar.Brand>
        <div className="rightAlignedContainer">
          <Navbar.Text className="">
            Signed in as: {user.username}
          </Navbar.Text>
          <Button
            id="signOutBtn"
            variant="danger"
            className="ml-1"
            onClick={onSignOut}
          >
            {
              signingOut ?
                <Spinner animation="border" role="status" size="sm" /> :
                <>Sign out</>
            }
          </Button>
        </div>
      </Container>
    </Navbar>
  )
}

export default NavBar