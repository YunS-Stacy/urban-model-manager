import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import IdentityNav from './IdentityNav';

const TopNavbar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Urban Model Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
        </Nav>
        <IdentityNav />
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNavbar;
