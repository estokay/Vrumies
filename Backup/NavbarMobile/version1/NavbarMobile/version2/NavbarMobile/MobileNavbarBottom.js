import React, { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaEnvelope,
  FaPlusSquare,
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

  const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileOptions = [
    { icon: <FaUserTie />, label: "Profile", action: () => navigate("/myprofilemobile") },
    { icon: <FaBookmark />, label: "Bookmarks", action: () => navigate("/bookmarks") },
    { icon: <FaCog />, label: "Settings", action: () => navigate("/settingsmobile") },
    { icon: <FaStore />, label: "Seller", action: () => navigate("/sellermobile") },
    { icon: <FaCoins />, label: "Tokens", action: () => navigate("/tokensmobile") },
    { icon: <FaSignOutAlt />, label: "Sign Out", action: async () => { await signOut(auth); navigate("/signin"); } },
  ];

  return (
    <nav className="bottom-navbar-container">
      <button className="bottom-navbar-btn" onClick={() => navigate("/homemobile")}>
        <FaHome className="bottom-navbar-icon" />
      </button>
      <button className="bottom-navbar-btn" onClick={() => navigate("/inboxmobile")}>
        <FaEnvelope className="bottom-navbar-icon" />
      </button>
      <button className="bottom-navbar-btn" onClick={() => setShowCreatePostOverlay(true)}>
        <FaPlusSquare className="bottom-navbar-icon" />
      </button>

      {showCreatePostOverlay && (
        <CreatePostOverlay
          isOpen={showCreatePostOverlay}   // add this prop
          onClose={() => setShowCreatePostOverlay(false)}
        />
      )}

      <button className="bottom-navbar-btn" onClick={() => navigate("/ordersmobile")}>
        <FaClipboard className="bottom-navbar-icon" />
      </button>

      <div style={{ position: "relative" }} ref={profileRef}>
        <button className="bottom-navbar-btn" onClick={toggleProfileDropdown}>
          <img
            src={profilePic || `${process.env.PUBLIC_URL}/default-profile.png`}
            alt="User"
            className="profile-photo-small-bottom"
            onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/default-profile.png`; }}
          />
        </button>

        {showProfileDropdown && (
          <div className="bottom-navbar-profile-dropdown">
            {profileOptions.map((btn, idx) => (
              <button key={idx} className="bottom-dropdown-btn" onClick={btn.action}>
                <span className="bottom-dropdown-icon">{btn.icon}</span>
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileNavbarBottom;