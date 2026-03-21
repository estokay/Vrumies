import React, { useRef, useEffect } from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CategoriesSlideDownMenu.css";

const CategoriesSlideDownMenu = ({ show, onClose }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

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
      buttons: [
        { icon: <FaStoreAlt />, label: "Market", action: () => navigate("/marketmobile") },
      ],
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  return (
    <div
      className={`top-navbar-sidebar-top ${show ? "open" : ""}`}
      ref={sidebarRef}
    >
      <div className="sidebar-header">
        <div className="sidebar-title">Explore Categories</div>

        <button
          className="top-navbar-btn sidebar-close-btn"
          onClick={onClose}
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
                  onClose();
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
  );
};

export default CategoriesSlideDownMenu;