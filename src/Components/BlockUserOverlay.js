import React, { useState } from "react";
import "./BlockUserOverlay.css";
import { useAuth } from "../AuthContext"; // adjust path
import { useBlockUser } from "./Hooks/useBlockUser"; // adjust path
import useGetUsername from "./Hooks/useGetUsername";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BlockUserOverlay({
  userId,        // user being blocked
  isOpen,
  from = "",
  onClose,
}) {
  const { currentUser } = useAuth();
  const { blockUser, loading, error } = useBlockUser();
  const [reason, setReason] = useState("");
  const username = useGetUsername(userId);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!currentUser || !userId) return;

    try {
      await blockUser(currentUser.uid, userId, reason, from);
      toast.success("User blocked successfully 🚫");
      onClose();
    } catch (err) {
      console.error("Block failed:", err);
      toast.error("Failed to block user ❌");
    }
  };

  return (
    <div className="block-overlay-backdrop" onClick={onClose}>
      <div
        className="block-overlay-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="block-overlay-close" onClick={onClose}>
          ✕
        </button>

        <h3>Block User?</h3>
        <p>This user will no longer be able to message or interact with you.</p>

        <small>User: {username}</small>
        <small>From: {from}</small>

        {/* Reason input */}
        <textarea
          className="block-overlay-input"
          placeholder="Reason (optional)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {error && <p className="block-error">Error blocking user.</p>}

        <div className="block-overlay-actions">
          <button className="block-cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="block-confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Blocking..." : "Block"}
          </button>
        </div>

        
      </div>
    </div>
  );
}