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
import "./ExploreCategories.css";

const ExploreCategories = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setShowSidebar(false);
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
      <nav className="ecnav-top-navbar-container">
        <div className="ecnav-top-navbar-left">
          <button className="ecnav-top-navbar-btn" onClick={toggleSidebar}>
            <div className="ecnav-top-navbar-item">
              <img
                src={`${process.env.PUBLIC_URL}/Mobile/ExploreCategories.png`}
                alt="Categories"
                className="ecnav-top-navbar-image-icon"
              />
              <span className="ecnav-top-navbar-label">Categories</span>
            </div>
          </button>
        </div>

      </nav>

      <div
        className={`ecnav-top-navbar-sidebar-top ${showSidebar ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="ecnav-sidebar-header">
          <div className="ecnav-sidebar-title">Explore Categories</div>

          <button
            className="ecnav-top-navbar-btn ecnav-sidebar-close-btn"
            onClick={() => setShowSidebar(false)}
          >
            <FaTimes className="ecnav-top-navbar-icon" />
          </button>
        </div>

        {categories.map((cat, idx) => (
          <div key={idx} className="ecnav-sidebar-category modern">
            <div className="ecnav-sidebar-category-label">{cat.label}</div>
            <div className="ecnav-sidebar-btn-grid">
              {cat.buttons.map((btn, i) => (
                <button
                  key={i}
                  className="ecnav-sidebar-btn modern-btn"
                  onClick={() => {
                    btn.action();
                    setShowSidebar(false);
                  }}
                >
                  <span className="ecnav-sidebar-btn-icon">{btn.icon}</span>
                  <span className="ecnav-sidebar-btn-text">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ExploreCategories;