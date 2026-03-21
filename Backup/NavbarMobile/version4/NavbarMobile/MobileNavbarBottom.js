import React, { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaEnvelope,
  FaPlus,
  FaUserTie,
  FaBookmark,
  FaStore,
  FaCog,
  FaClipboard,
  FaCoins,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useGetProfilePic from "../../Hooks/useGetProfilePic";
import CreatePostOverlay from "../../CreatePost/CreatePostOverlay";
import "./MobileNavbarBottom.css";

const MobileNavbarBottom = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const profilePic = useGetProfilePic(userId);

  const [showCreatePostOverlay, setShowCreatePostOverlay] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  const toggleProfileDropdown = () =>
    setShowProfileDropdown(!showProfileDropdown);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileOptions = [
    { icon: <FaUserTie />, label: "Profile", action: () => navigate("/myprofilemobile") },
    { icon: <FaBookmark />, label: "Bookmarks", action: () => navigate("/bookmarks") },
    { icon: <FaCog />, label: "Settings", action: () => navigate("/settingsmobile") },
    { icon: <FaStore />, label: "Seller", action: () => navigate("/sellermobile") },
    { icon: <FaCoins />, label: "Tokens", action: () => navigate("/tokensmobile") },
    {
      icon: <FaSignOutAlt />,
      label: "Sign Out",
      action: async () => {
        await signOut(auth);
        navigate("/signin");
      },
    },
  ];

  return (
    <>
      <div className="mobile-navbar-wrapper">

        <nav className="mobile-navbar">

          <button
            className="mobile-nav-btn"
            onClick={() => navigate("/homemobile")}
          >
            <FaHome />
            <span className="mobile-nav-label">Home</span>
          </button>

          <button
            className="mobile-nav-btn"
            onClick={() => navigate("/inboxmobile")}
          >
            <FaEnvelope />
            <span className="mobile-nav-label">Messages</span>
          </button>

          <div className="nav-gap"></div>

          <button
            className="mobile-nav-btn"
            onClick={() => navigate("/ordersmobile")}
          >
            <FaClipboard />
            <span className="mobile-nav-label">Orders</span>
          </button>

          <div className="profile-wrapper" ref={profileRef}>
            <button
              className="mobile-nav-btn"
              onClick={toggleProfileDropdown}
            >
              <img
                src={
                  profilePic ||
                  `${process.env.PUBLIC_URL}/default-profile.png`
                }
                alt="User"
                className="mobile-nav-profile-pic"
                onError={(e) => {
                  e.target.src = `${process.env.PUBLIC_URL}/default-profile.png`;
                }}
              />
              <span className="mobile-nav-label">Profile</span>
            </button>

          </div>
        </nav>

        {showProfileDropdown && (
              <div className="profile-dropdown">
                {profileOptions.map((btn, idx) => (
                  <button
                    key={idx}
                    className="dropdown-btn"
                    onClick={btn.action}
                  >
                    <span className="dropdown-icon">{btn.icon}</span>
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            )}

        {/* CREATE BUTTON */}
        <button
          className="create-post-btn"
          onClick={() => setShowCreatePostOverlay(true)}
        >
          <FaPlus />
        </button>

      </div>

      {showCreatePostOverlay && (
        <CreatePostOverlay
          isOpen={showCreatePostOverlay}
          onClose={() => setShowCreatePostOverlay(false)}
        />
      )}
    </>
  );
};

export default MobileNavbarBottom;