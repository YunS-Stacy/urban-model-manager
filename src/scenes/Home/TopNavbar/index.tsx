import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import IdentityNav from './IdentityNav';

const TopNavbar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">Urban Model Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse>
        {/* CSS fix for calcite-maps */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IdentityNav />
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNavbar;
