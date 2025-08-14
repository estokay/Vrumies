import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import CreatePostOverlay from '../CreatePost/CreatePostOverlay';
import DropDownButtons from './DropDownButtons';
import Notifications from './Notifications';
import { useNavigate } from 'react-router-dom';

function NavbarWithPost() {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const handlePostClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation();
    if (showDropdown) {
      // Close profile if open
      setShowDropdown(false);
    } else {
      // Open profile and close notifications
      setShowDropdown(true);
      setShowNotifications(false);
    }
  };

  const handleNotificationsClick = (event) => {
    event.stopPropagation();
    if (showNotifications) {
      // Close notifications if open
      setShowNotifications(false);
    } else {
      // Open notifications and close profile
      setShowNotifications(true);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
      if (
        showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    const listenerTimeout = setTimeout(() => {
      if (showDropdown || showNotifications) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }, 100);

    return () => {
      clearTimeout(listenerTimeout);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showNotifications]);

  return (
    <>
      <nav className="navbar" style={{ position: 'relative', zIndex: 10 }}>
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
          <button type="button" onClick={() => navigate('/cart')}>
            <img src={`${process.env.PUBLIC_URL}/cart.png`} alt="Cart" />
          </button>
          <button type="button" onClick={() => navigate('/inbox')}>
            <img src={`${process.env.PUBLIC_URL}/messages.png`} alt="Messages" />
          </button>
          <button type="button" onClick={() => navigate('/tokens')}>
            <img src={`${process.env.PUBLIC_URL}/tokens.png`} alt="Tokens" />
          </button>
          <button
            className="notifications-btn"
            onClick={handleNotificationsClick}
          >
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
              top: '100%',
              zIndex: 1000
            }}
          >
            <DropDownButtons />
          </div>
        )}

        {showNotifications && (
          <div
            ref={notificationsRef}
            style={{
              position: 'absolute',
              right: '20px',
              top: '100%',
              zIndex: 1000,
              transform: 'translateY(10px)'
            }}
          >
            <Notifications
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}
      </nav>

      <CreatePostOverlay
        isOpen={showOverlay}
        onClose={handleCloseOverlay}
      />
    </>
  );
}

export default NavbarWithPost;