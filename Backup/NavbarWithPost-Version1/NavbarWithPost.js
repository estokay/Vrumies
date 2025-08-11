import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import CreatePostOverlay from '../CreatePost/CreatePostOverlay';
import DropDownButtons from './DropDownButtons';
import { useNavigate } from 'react-router-dom';

function NavbarWithPost() {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handlePostClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.profile-btn')
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
          <button type="button" onClick={() => navigate('/orders')}>
            <img src={`${process.env.PUBLIC_URL}/orders.png`} alt="Orders" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/cart.png`} alt="Cart" />
          </button>
          <button type="button" onClick={() => navigate('/inbox')}>
            <img src={`${process.env.PUBLIC_URL}/messages.png`} alt="Messages" />
          </button>
          <button type="button" onClick={() => navigate('/tokens')}>
            <img src={`${process.env.PUBLIC_URL}/tokens.png`} alt="Tokens" />
          </button>
          <button>
            <img src={`${process.env.PUBLIC_URL}/notifications.png`} alt="Notifications" />
          </button>
          <button
            className="profile-btn"
            onClick={toggleDropdown}
          >
            <img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Profile" />
          </button>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              right: '20px',
              top: '100%', // flush with navbar bottom
              zIndex: 1000
            }}
          >
            <DropDownButtons />
          </div>
        )}
      </nav>

      <CreatePostOverlay isOpen={showOverlay} onClose={handleCloseOverlay} />
    </>
  );
}

export default NavbarWithPost;
