import axios from 'axios';
import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { getCsrfToken } from '../utils';

import './NavBar.css';

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

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));

  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="/">Journal Jam</Navbar.Brand>
        <div className="sb-c-10">
          <Button
            id='createEntryBtn'
            variant="light"
            onClick={() => { }}
          >
            <div className='d-flex'>
              <i className="bi bi-plus d-flex align-items-center" style={{ 'fontSize': '22px' }}></i>
              New Entry
            </div>
          </Button>
          <Button
            variant="light"
            onClick={() => { }}
          >Settings</Button>
          <Button
            variant="light"
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