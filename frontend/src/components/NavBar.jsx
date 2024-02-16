import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import './NavBar.css';
import axios from 'axios';
import { getCsrfToken } from '../utils';

const NavBar = ({ user, setToast }) => {
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
      // console.log(res);
      window.location.pathname = '/login';
      setToast({ show: true, header: 'Successfully signed out!' });
    } catch (error) {
      setToast({ show: true, header: 'Unable to sign out.', body: error.message });
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