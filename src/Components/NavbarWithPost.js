import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import CreatePostOverlay from '../CreatePost/CreatePostOverlay';

function NavbarWithPost() {
  const [showOverlay, setShowOverlay] = useState(false);

  const handlePostClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img
            src={`${process.env.PUBLIC_URL}/logo-black.png`}
            alt="Logo"
            className="logo"
          />
          <ul className="nav-links">
            <li><Link to="/">Content</Link></li>
            <li><Link to="/request">Requests</Link></li>
            <li><Link to="/market">Market</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/directory">Directory</Link></li>
          </ul>
        </div>

        <div className="navbar-buttons">
          <button onClick={handlePostClick}>
            <img src={`${process.env.PUBLIC_URL}/post.png`} alt="Post" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/orders.png`} alt="Orders" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/cart.png`} alt="Cart" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/messages.png`} alt="Messages" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/tokens.png`} alt="Tokens" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/notifications.png`} alt="Notifications" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Profile" />
          </button>
        </div>
      </nav>

      <CreatePostOverlay isOpen={showOverlay} onClose={handleCloseOverlay} />
    </>
  );
}

export default NavbarWithPost;
