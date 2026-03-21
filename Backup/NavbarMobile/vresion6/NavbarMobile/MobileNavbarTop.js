import React, { useState, useRef, useEffect } from "react";
import {
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setShowSidebar(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    {
      label: "Social",
      buttons: [
        { icon: <FaVideo />, label: "Videos", action: () => navigate("/videosmobile") },
        { icon: <FaRegEdit />, label: "Blogs", action: () => navigate("/blogsmobile") },
        { icon: <FaCar />, label: "Vehicles", action: () => navigate("/vehiclesmobile") },
        { icon: <FaCalendarAlt />, label: "Events", action: () => navigate("/eventsmobile") },
      ],
    },
    {
      label: "Market",
      buttons: [{ icon: <FaStoreAlt />, label: "Market", action: () => navigate("/marketmobile") }],
    },
    {
      label: "Directory",
      buttons: [
        { icon: <FaWrench />, label: "Directory", action: () => navigate("/directorymobile") },
        { icon: <FaHandsHelping />, label: "Requests", action: () => navigate("/requestmobile") },
      ],
    },
    {
      label: "Loadboard",
      buttons: [
        { icon: <FaClipboardList />, label: "Loads", action: () => navigate("/loadsmobile") },
        { icon: <FaTruck />, label: "Trucks", action: () => navigate("/trucksmobile") },
      ],
    },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="top-navbar-container">
        <div className="top-navbar-left">
          <button className="top-navbar-btn" onClick={toggleSidebar}>
            <div className="top-navbar-item">
              <img
                src={`${process.env.PUBLIC_URL}/Mobile/ExploreCategories.png`}
                alt="Categories"
                className="top-navbar-image-icon"
              />
              <span className="top-navbar-label">Categories</span>
            </div>
          </button>
        </div>

        <div className="top-navbar-right">
          <button className="top-navbar-btn" onClick={() => navigate("/cartmobile")}>
            <div className="top-navbar-item">
              <img
                src={`${process.env.PUBLIC_URL}/Mobile/Cart.png`}
                alt="Cart"
                className="top-navbar-image-icon"
              />
              <span className="top-navbar-label">Cart</span>
            </div>
          </button>

          <div ref={notificationsRef} className="notifications-wrapper">
            <button className="top-navbar-btn" onClick={toggleNotifications}>
              <div className="top-navbar-item">
                <img
                  src={`${process.env.PUBLIC_URL}/Mobile/Notifications.png`}
                  alt="Notifications"
                  className="top-navbar-image-icon"
                />
                <span className="top-navbar-label">Notifications</span>
              </div>
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

      {/* TOP SLIDE-DOWN SIDEBAR */}
      <div
        className={`top-navbar-sidebar-top ${showSidebar ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <div className="sidebar-title">Explore Categories</div>

          <button
            className="top-navbar-btn sidebar-close-btn"
            onClick={() => setShowSidebar(false)}
          >
            <FaTimes className="top-navbar-icon" />
          </button>
        </div>

        {categories.map((cat, idx) => (
          <div key={idx} className="sidebar-category modern">
            <div className="sidebar-category-label">{cat.label}</div>
            <div className="sidebar-btn-grid">
              {cat.buttons.map((btn, i) => (
                <button
                  key={i}
                  className="sidebar-btn modern-btn"
                  onClick={() => {
                    btn.action();
                    setShowSidebar(false);
                  }}
                >
                  <span className="sidebar-btn-icon">{btn.icon}</span>
                  <span className="sidebar-btn-text">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MobileNavbarTop;