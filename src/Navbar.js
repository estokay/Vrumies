import React from 'react';
import './Navbar.css'; // optional: create this if you want to style it

function Navbar() {
  return (
    <nav className="navbar">
    <div className="navbar-left">
      <img src={`${process.env.PUBLIC_URL}/logo-black.png`} alt="Logo" className="logo" />
      <ul className="nav-links">
        <li><a href="/">Content</a></li>
        <li><a href="/about">Requests</a></li>
        <li><a href="/contact">Market</a></li>
        <li><a href="/contact">Events</a></li>
        <li><a href="/contact">Directory</a></li>
      </ul>
      </div>
    </nav>
  );
}

export default Navbar;