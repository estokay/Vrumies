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
import CategoriesSlideDownMenu from "./CategoriesSlideDownMenu";
import ProfileMenu from "./ProfileMenu";

const MobileNavbarTop = ({ notificationsComponent }) => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationsRef = useRef(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

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

          <div className="top-navbar-logo">
            <img
              src={`${process.env.PUBLIC_URL}/Mobile/VrumiesLogoMobile.png`}
              alt="Vrumies"
              className="top-navbar-logo-img"
            />
          </div>
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
                <span className="top-navbar-label">Activity</span>
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

           <button
              className="top-navbar-btn"
              onClick={() => setShowProfileMenu(true)}
            >
              <div className="top-navbar-item">
                <img
                  src={`${process.env.PUBLIC_URL}/Mobile/More.png`}
                  alt="More"
                  className="top-navbar-image-icon"
                />
                <span className="top-navbar-label">More</span>
              </div>
            </button>
        </div>
      </nav>
      {/* ✅ Categories Slide Down Menu */}
      <CategoriesSlideDownMenu
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
      <ProfileMenu
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />
    </>
  );
};

export default MobileNavbarTop;