import React from 'react';
import './App.css';

function Header() {
  return (
    <header className="App-header">
      <img
        src={`${process.env.PUBLIC_URL}/logo-clear.png`}
        className="App-logo"
        alt="logo"
      />
      <p>The Automotive Marketplace</p>
      <a
        className="App-link"
        href="https://vrumies.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go to the Vrumies Website
      </a>
    </header>
  );
}

export default Header;
