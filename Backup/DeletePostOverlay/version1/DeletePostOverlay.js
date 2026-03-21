// src/components/DeletePostOverlay.jsx
import React from "react";
import "./DeletePostOverlay.css";

export default function DeletePostOverlay({ postId, isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="delete-overlay-backdrop" onClick={onClose}>
      <div
        className="delete-overlay-box"
        onClick={(e) => e.stopPropagation()} // prevent outside click close
      >
        {/* X Button */}
        <button className="delete-overlay-close" onClick={onClose}>
          ✕
        </button>

        <h3>Delete Post?</h3>
        <p>Are you sure you want to delete this post?</p>
        <small>Post ID: {postId}</small>

        <div className="delete-overlay-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-btn" onClick={() => onConfirm(postId)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}