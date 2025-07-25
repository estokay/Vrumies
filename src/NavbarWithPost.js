import React, { useState } from 'react';
import './NavbarWithPost.css';
import CreatePostOverlay from './CreatePostOverlay';

function NavbarWithPost() {
  const [showOverlay, setShowOverlay] = useState(false);

  const openOverlay = () => setShowOverlay(true);
  const closeOverlay = () => setShowOverlay(false);

  return (
    <>
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

        <div className="navbar-buttons">
          <button onClick={openOverlay}>
            <img src={`${process.env.PUBLIC_URL}/post.png`} alt="Post" />
          </button>
          <button><img src={`${process.env.PUBLIC_URL}/orders.png`} alt="Orders" /></button>
          <button><img src={`${process.env.PUBLIC_URL}/cart.png`} alt="Cart" /></button>
          <button><img src={`${process.env.PUBLIC_URL}/messages.png`} alt="Messages" /></button>
          <button><img src={`${process.env.PUBLIC_URL}/tokens.png`} alt="Tokens" /></button>
          <button><img src={`${process.env.PUBLIC_URL}/notifications.png`} alt="Notifications" /></button>
          <button><img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Profile" /></button>
        </div>
      </nav>

      <CreatePostOverlay isOpen={showOverlay} onClose={closeOverlay} />
    </>
  );
}

export default NavbarWithPost;
