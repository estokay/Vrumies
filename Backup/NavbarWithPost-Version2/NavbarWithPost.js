import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import CreatePostOverlay from '../CreatePost/CreatePostOverlay';
import DropDownButtons from './DropDownButtons';
import Notifications from './Notifications'; // Import the Notifications component
import { useNavigate } from 'react-router-dom';

function NavbarWithPost() {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // State for Notifications component
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null); // Ref for the Notifications *wrapper* div

  const handlePostClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const toggleDropdown = (event) => { // Accept event object
    event.stopPropagation(); // Stop click from bubbling up to document
    // If the dropdown is currently closed and about to open, close notifications
    if (!showDropdown) {
      setShowNotifications(false);
    }
    setShowDropdown((prev) => !prev);
  };

  // Function to toggle Notifications component visibility
  const handleNotificationsClick = (event) => { // Accept event object
    event.stopPropagation(); // Stop click from bubbling up to document
    // If notifications are currently closed and about to open, close the dropdown
    if (!showNotifications) {
      setShowDropdown(false);
    }
    setShowNotifications((prev) => !prev);
  };

  // Effect to handle clicks outside the dropdown and notifications panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown logic:
      // If dropdown is open AND click is outside the dropdown ref
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      // Close notifications logic:
      // If notifications are open AND click is outside the notifications ref
      if (
        showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    // Add event listener to the document only when a panel is open
    // The timeout here is essential to prevent the immediate closing due to event bubbling.
    const listenerTimeout = setTimeout(() => {
      if (showDropdown || showNotifications) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }, 100); // Small delay to ensure the component has rendered before listener is active

    // Cleanup function to remove the event listener and clear timeout
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
          <button>
            <img src={`${process.env.PUBLIC_URL}/cart.png`} alt="Cart" />
          </button>
          <button type="button" onClick={() => navigate('/inbox')}>
            <img src={`${process.env.PUBLIC_URL}/messages.png`} alt="Messages" />
          </button>
          <button type="button" onClick={() => navigate('/tokens')}>
            <img src={`${process.env.PUBLIC_URL}/tokens.png`} alt="Tokens" />
          </button>
          {/* Notifications button with onClick handler */}
          <button className="notifications-btn" onClick={handleNotificationsClick}>
            <img src={`${process.env.PUBLIC_URL}/notifications.png`} alt="Notifications" />
          </button>
          <button
            className="profile-btn"
            onClick={toggleDropdown}
          >
            <img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Profile" />
          </button>
        </div>

        {/* Dropdown component, rendered conditionally */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              right: '20px',
              top: '100%', // Positioned just below the navbar
              zIndex: 1000 // Ensures it appears above other content
            }}
          >
            <DropDownButtons />
          </div>
        )}

        {/* Notifications component, rendered conditionally and positioned */}
        {showNotifications && (
          <div
            ref={notificationsRef} // Ref attached to this wrapper div for click-outside detection
            style={{
              position: 'absolute',
              right: '20px',
              top: '100%', // Positioned just below the navbar
              zIndex: 1000, // Ensures it appears above other content
              transform: 'translateY(10px)' // Small offset for visual separation
            }}
          >
            <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>
        )}
      </nav>

      {/* CreatePostOverlay component */}
      <CreatePostOverlay isOpen={showOverlay} onClose={handleCloseOverlay} />
    </>
  );
}

export default NavbarWithPost;