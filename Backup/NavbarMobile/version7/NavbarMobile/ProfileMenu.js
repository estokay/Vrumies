import React, { useRef, useEffect } from "react";
import {
  FaUserTie,
  FaBookmark,
  FaCog,
  FaStore,
  FaCoins,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "./ProfileMenu.css";

const ProfileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const menuRef = useRef(null);
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    const diff = currentY.current - startY.current;

    if (diff > 120) {
      onClose(); // swipe down enough → close
    } else {
      // snap back
      sheetRef.current.style.transform = `translateY(0)`;
    }
  };

  const options = [
    { icon: <FaBookmark />, label: "Bookmarks", action: () => navigate("/bookmarksmobile") },
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

  if (!isOpen) return null;

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div
        className="pm-sheet"
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="pm-handle" />
        <div className="pm-header">
          <h3>More</h3>
          <div className="pm-close-btn" onClick={onClose}>
            <FaTimes />
          </div>
        </div>

        <div className="pm-body">
          {options.map((btn, idx) => (
            <button
              key={idx}
              className="pm-btn"
              onClick={() => {
                btn.action();
                onClose();
              }}
            >
              <span className="pm-icon">{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;