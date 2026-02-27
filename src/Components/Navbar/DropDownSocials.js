import React from "react";
import "./DropDownSocials.css";
import { FaVideo, FaRegEdit, FaCar, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DropDownSocials = () => {
  const navigate = useNavigate();

  const links = [
    { icon: <FaVideo />, label: "Videos", route: "/videos" },
    { icon: <FaRegEdit />, label: "Blogs", route: "/blogs" },
    { icon: <FaCar />, label: "Vehicles", route: "/vehicles" },
    { icon: <FaCalendarAlt />, label: "Events", route: "/events" },
  ];

  return (
    <div className="social-dropdown-container">
      {links.map((item, idx) => (
        <button
          key={idx}
          className="social-dropdown-btn"
          onClick={() => navigate(item.route)}
        >
          <span className="social-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DropDownSocials;
