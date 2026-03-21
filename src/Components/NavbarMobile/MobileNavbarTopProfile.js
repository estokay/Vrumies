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
  FaTimes
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MobileNavbarTopProfile.css";

const MobileNavbarTopProfile = ({ notificationsComponent }) => {
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
      <nav className="mntp-top-navbar-container">
        <div className="mntp-top-navbar-left">
          <button className="mntp-top-navbar-btn" onClick={toggleSidebar}>
            <div className="mntp-top-navbar-item">
              <img
                src={`${process.env.PUBLIC_URL}/Mobile/ExploreCategories.png`}
                alt="Categories"
                className="mntp-top-navbar-image-icon"
              />
              <span className="mntp-top-navbar-label">Categories Type stuff</span>
            </div>
          </button>
        </div>

        <div className="mntp-top-navbar-right">
          <button className="mntp-top-navbar-btn" onClick={() => navigate("/cartmobile")}>
            <div className="mntp-top-navbar-item">
              <img
                src={`${process.env.PUBLIC_URL}/Mobile/Cart.png`}
                alt="Cart"
                className="mntp-top-navbar-image-icon"
              />
              <span className="mntp-top-navbar-label">Cart</span>
            </div>
          </button>

          <div ref={notificationsRef} className="mntp-notifications-wrapper">
            <button className="mntp-top-navbar-btn" onClick={toggleNotifications}>
              <div className="mntp-top-navbar-item">
                <img
                  src={`${process.env.PUBLIC_URL}/Mobile/Notifications.png`}
                  alt="Notifications"
                  className="mntp-top-navbar-image-icon"
                />
                <span className="mntp-top-navbar-label">Notifications</span>
              </div>
            </button>

            {showNotifications && (
              <div className="mntp-top-navbar-notifications-dropdown">
                {notificationsComponent || (
                  <div className="mntp-top-navbar-notification-empty">No notifications</div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`mntp-top-navbar-sidebar-top ${showSidebar ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="mntp-sidebar-header">
          <div className="mntp-sidebar-title">Explore Categories</div>

          <button
            className="mntp-top-navbar-btn mntp-sidebar-close-btn"
            onClick={() => setShowSidebar(false)}
          >
            <FaTimes className="mntp-top-navbar-icon" />
          </button>
        </div>

        {categories.map((cat, idx) => (
          <div key={idx} className="mntp-sidebar-category modern">
            <div className="mntp-sidebar-category-label">{cat.label}</div>
            <div className="mntp-sidebar-btn-grid">
              {cat.buttons.map((btn, i) => (
                <button
                  key={i}
                  className="mntp-sidebar-btn modern-btn"
                  onClick={() => {
                    btn.action();
                    setShowSidebar(false);
                  }}
                >
                  <span className="mntp-sidebar-btn-icon">{btn.icon}</span>
                  <span className="mntp-sidebar-btn-text">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MobileNavbarTopProfile;