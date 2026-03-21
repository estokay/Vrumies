import React, { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaBell,
  FaVideo,
  FaRegEdit,
  FaCar,
  FaCalendarAlt,
  FaStoreAlt,
  FaWrench,
  FaHandsHelping,
  FaClipboardList,
  FaTruck,
  FaTimes,
  FaShoppingCart
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MobileNavbarTop.css";

const MobileNavbarTop = ({ notificationsComponent }) => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const sidebarRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  // Close sidebar / notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    {
      label: "Social",
      buttons: [
        { icon: <FaVideo />, label: "Videos", action: () => navigate("/videos") },
        { icon: <FaRegEdit />, label: "Blogs", action: () => navigate("/blogs") },
        { icon: <FaCar />, label: "Vehicles", action: () => navigate("/vehicles") },
        { icon: <FaCalendarAlt />, label: "Events", action: () => navigate("/events") },
      ],
    },
    {
      label: "Market",
      buttons: [{ icon: <FaStoreAlt />, label: "Market", action: () => navigate("/marketmobile") }],
    },
    {
      label: "Directory",
      buttons: [
        { icon: <FaWrench />, label: "Directory", action: () => navigate("/directory") },
        { icon: <FaHandsHelping />, label: "Requests", action: () => navigate("/request") },
      ],
    },
    {
      label: "Loadboard",
      buttons: [
        { icon: <FaClipboardList />, label: "Loads", action: () => navigate("/loads") },
        { icon: <FaTruck />, label: "Trucks", action: () => navigate("/trucks") },
      ],
    },
  ];

  return (
    <>
      <nav className="top-navbar-container">
        <div className="top-navbar-left">
          <button className="top-navbar-btn" onClick={toggleSidebar}>
            <FaBars className="top-navbar-icon" />
          </button>
        </div>

        <div className="top-navbar-right">

          <button
            className="top-navbar-btn"
            onClick={() => navigate("/cartmobile")}
          >
            <FaShoppingCart className="top-navbar-icon" />
          </button>

          <div ref={notificationsRef} style={{ position: "relative" }}>
            <button className="top-navbar-btn" onClick={toggleNotifications}>
              <FaBell className="top-navbar-icon" />
            </button>

            {showNotifications && (
              <div className="top-navbar-notifications-dropdown">
                {notificationsComponent || (
                  <div className="top-navbar-notification-empty">No notifications</div>
                )}
              </div>
            )}
          </div>

        </div>
      </nav>

      {showSidebar && (
        <div className="top-navbar-sidebar" ref={sidebarRef}>
          <button
            className="top-navbar-btn"
            style={{ alignSelf: "flex-end", marginBottom: "10px" }}
            onClick={() => setShowSidebar(false)}
          >
            <FaTimes className="top-navbar-icon" />
          </button>

          {categories.map((cat, idx) => (
            <div key={idx} className="sidebar-category">
              <div className="sidebar-category-label">{cat.label}</div>
              {cat.buttons.map((btn, i) => (
                <button
                  key={i}
                  className="sidebar-btn"
                  onClick={() => {
                    btn.action();
                    setShowSidebar(false);
                  }}
                >
                  <span className="sidebar-btn-icon">{btn.icon}</span>
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MobileNavbarTop;