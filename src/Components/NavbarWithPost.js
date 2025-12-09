import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import CreatePostOverlay from '../CreatePost/CreatePostOverlay';
import DropDownDirectory from './DropDownDirectory';
import DropDownButtons from './DropDownButtons';
import Notifications from './Notifications';
import DropDownSocials from './DropDownSocials';
import DropDownLoadBoard from './DropDownLoadBoard'; // new import
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";

function NavbarWithPost() {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSocialDropdown, setShowSocialDropdown] = useState(false);
  const [showDirectoryDropdown, setShowDirectoryDropdown] = useState(false);
  const [showLoadboardDropdown, setShowLoadboardDropdown] = useState(false); // new
  const [userPhoto, setUserPhoto] = useState(null);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const socialRef = useRef(null);
  const directoryRef = useRef(null);
  const loadboardRef = useRef(null); // new

  // Fetch Google profile photo
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user?.photoURL) {
      setUserPhoto(user.photoURL);
    }
  }, []);

  const handlePostClick = () => setShowOverlay(true);
  const handleCloseOverlay = () => setShowOverlay(false);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setShowNotifications(false);
      setShowSocialDropdown(false);
      setShowDirectoryDropdown(false);
      setShowLoadboardDropdown(false);
    }
  };

  const handleNotificationsClick = (event) => {
    event.stopPropagation();
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setShowDropdown(false);
      setShowSocialDropdown(false);
      setShowDirectoryDropdown(false);
      setShowLoadboardDropdown(false);
    }
  };

  const toggleSocialDropdown = (event) => {
    event.stopPropagation();
    setShowSocialDropdown(!showSocialDropdown);
    if (!showSocialDropdown) {
      setShowDropdown(false);
      setShowNotifications(false);
      setShowDirectoryDropdown(false);
      setShowLoadboardDropdown(false);
    }
  };

  const toggleDirectoryDropdown = (event) => {
    event.stopPropagation();
    setShowDirectoryDropdown(!showDirectoryDropdown);
    if (!showDirectoryDropdown) {
      setShowDropdown(false);
      setShowNotifications(false);
      setShowSocialDropdown(false);
      setShowLoadboardDropdown(false);
    }
  };

  const toggleLoadboardDropdown = (event) => {
    event.stopPropagation();
    setShowLoadboardDropdown(!showLoadboardDropdown);
    if (!showLoadboardDropdown) {
      setShowDropdown(false);
      setShowNotifications(false);
      setShowSocialDropdown(false);
      setShowDirectoryDropdown(false);
    }
  };

  // Handle click outside for all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (showNotifications && notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (showSocialDropdown && socialRef.current && !socialRef.current.contains(event.target)) {
        setShowSocialDropdown(false);
      }
      if (showDirectoryDropdown && directoryRef.current && !directoryRef.current.contains(event.target)) {
        setShowDirectoryDropdown(false);
      }
      if (showLoadboardDropdown && loadboardRef.current && !loadboardRef.current.contains(event.target)) {
        setShowLoadboardDropdown(false);
      }
    };

    if (showDropdown || showNotifications || showSocialDropdown || showDirectoryDropdown || showLoadboardDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showNotifications, showSocialDropdown, showDirectoryDropdown, showLoadboardDropdown]);

  return (
    <>
      <nav className="navbar" style={{ position: 'relative', zIndex: 10 }}>
        <div className="navbar-left">
          <img src={`${process.env.PUBLIC_URL}/logo-black.png`} alt="Logo" className="logo" />
          <ul className="nav-links">
            <li
              className="nav-social-link"
              onClick={toggleSocialDropdown}
              ref={socialRef}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              Social
              {showSocialDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    transform: 'translate(-50px, 50px)',
                    zIndex: 1000,
                  }}
                >
                  <DropDownSocials />
                </div>
              )}
            </li>

            <li><Link to="/market">Market</Link></li>

            <li
              className="nav-directory-link"
              onClick={toggleDirectoryDropdown}
              ref={directoryRef}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              Directory
              {showDirectoryDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 20,
                    transform: 'translate(-50px, 50px)',
                    zIndex: 1000,
                  }}
                >
                  <DropDownDirectory />
                </div>
              )}
            </li>

            <li
              className="nav-loadboard-link"
              onClick={toggleLoadboardDropdown}
              ref={loadboardRef}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              Loadboard
              {showLoadboardDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 20,
                    transform: 'translate(-50px, 50px)',
                    zIndex: 1000,
                  }}
                >
                  <DropDownLoadBoard />
                </div>
              )}
            </li>
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
          <button className="notifications-btn" onClick={handleNotificationsClick}>
            <img src={`${process.env.PUBLIC_URL}/notifications.png`} alt="Notifications" />
          </button>
          <button className="profile-btn" onClick={toggleDropdown}>
            <img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Profile" />
            {userPhoto && <img src={userPhoto} alt="User" className="profile-photo" />}
          </button>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            style={{ position: 'absolute', right: '20px', top: '100%', zIndex: 1000 }}
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
            <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>
        )}
      </nav>

      <CreatePostOverlay isOpen={showOverlay} onClose={handleCloseOverlay} />
    </>
  );
}

export default NavbarWithPost;
