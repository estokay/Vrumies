import React from "react";
import '../../Components/Css/ProfileCategories.css';
import {
  FaVideo,
  FaPenFancy,
  FaCar,
  FaCalendarAlt,
  FaStore,
  FaBook,
  FaClipboardList,
  FaTruck,
  FaListAlt,
} from "react-icons/fa";

const categories = [
  { id: "videos", label: "Videos", icon: <FaVideo /> },
  { id: "blogs", label: "Blogs", icon: <FaPenFancy /> },
  { id: "vehicles", label: "Vehicles", icon: <FaCar /> },
  { id: "events", label: "Events", icon: <FaCalendarAlt /> },
  { id: "market", label: "Market", icon: <FaStore /> },
  { id: "directory", label: "Directory", icon: <FaBook /> },
  { id: "requests", label: "Requests", icon: <FaListAlt /> },
  { id: "loads", label: "Loads", icon: <FaClipboardList /> },
  { id: "trucks", label: "Trucks", icon: <FaTruck /> },
];

export default function ViewProfileCategories({ selected, setSelected }) {
  return (
    <div className="profile-categories-grid">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`profile-category-btn ${
            selected === cat.id ? "selected" : ""
          }`}
          onClick={() => setSelected(cat.id)}
        >
          <span className="profile-category-icon">{cat.icon}</span>
          <span className="profile-category-label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
