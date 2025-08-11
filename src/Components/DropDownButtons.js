import React from "react";
import "./DropDownButtons.css";
import { FaUserTie, FaBookmark, FaStore, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const DropDownButtons = () => {
    const navigate = useNavigate();
  return (
    <div className="dropdown-buttons">
      <button className="dropdown-btn">
        <FaUserTie className="icon green" />
        <span>Profile</span>
      </button>

      <button className="dropdown-btn">
        <FaBookmark className="icon green" />
        <span>Bookmarks</span>
      </button>

      <button className="dropdown-btn">
        <FaStore className="icon green" />
        <span>Seller</span>
      </button>

      <button className="dropdown-btn" onClick={() => navigate('/adminpanel')}>
        <FaCog className="icon green" />
        <span>Settings</span>
      </button>

      <button className="dropdown-btn" onClick={() => navigate('/signin')}>
        <FaSignOutAlt className="icon green" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default DropDownButtons;
