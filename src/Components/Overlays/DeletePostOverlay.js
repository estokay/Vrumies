import React from "react";
import "./DeletePostOverlay.css";

export default function DeletePostOverlay({ postId, isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="dpo-backdrop" onClick={onClose}>
      <div className="dpo-container" onClick={(e) => e.stopPropagation()}>
        <button className="dpo-close-btn" onClick={onClose}>✕</button>

        <h2 className="dpo-title">Delete Post?</h2>
        <p className="dpo-message">Are you sure you want to delete this post?</p>
        <small className="dpo-postid">Post ID: {postId}</small>

        <div className="dpo-actions">
          <button className="dpo-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="dpo-delete-btn" onClick={() => onConfirm(postId)}>Delete</button>
        </div>
      </div>
    </div>
  );
}