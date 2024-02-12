import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar = () => {
  return (
    <Navbar bg="light" expand="lg" className={styles.navbar}>
      <Container className={styles.navbarContainer}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="http://127.0.0.1:8000/" className={styles.navLink}>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="http://127.0.0.1:8000/login" className={styles.navLink}>
              Log In
            </Nav.Link>
            <Nav.Link as={NavLink} to="http://127.0.0.1:8000/signup" className={styles.navLink}>
              Sign Up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;