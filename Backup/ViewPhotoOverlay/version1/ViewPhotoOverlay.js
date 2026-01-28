import React from "react";
import { FaTimes } from "react-icons/fa";
import "./ViewPhotoOverlay.css";

export default function ViewPhotoOverlay({ photoUrl, onClose }) {
  if (!photoUrl) return null;

  // Prevent clicks on the image from closing the overlay
  const handleImageClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="viewphotooverlay-container"
      onClick={onClose} // clicking outside closes overlay
    >
      <div
        className="viewphotooverlay-inner"
        onClick={handleImageClick} // clicking inside does NOT close overlay
      >
        <div className="viewphotooverlay-image-wrapper">
          <img
            src={photoUrl}
            alt="Expanded View"
            className="viewphotooverlay-image"
          />
          <button
            className="viewphotooverlay-close-btn"
            onClick={onClose}
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
}
