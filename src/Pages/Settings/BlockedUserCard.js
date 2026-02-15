import React from "react";
import useGetUsername from "../../Components/Hooks/useGetUsername";
import useGetProfilePic from "../../Components/Hooks/useGetProfilePic";
import { useAuth } from "../../AuthContext";
import useUnblockUser from "../../Components/Hooks/useUnblockUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BlockedUserCard({ user, onUnblocked }) {
  const { unblockUser, loading } = useUnblockUser();
  const username = useGetUsername(user.id);
  const profilePic = useGetProfilePic(user.id);

  const handleUnblock = async () => {
    try {
      await unblockUser(user.id);
      toast.success(`${username} has been unblocked! 🚫`);
      onUnblocked(user.id); // Notify parent to update UI
    } catch (err) {
      console.error(err);
      toast.error("Failed to unblock user ❌");
    }
  };

  return (
    <div className="blocked-card">
      <img src={profilePic} alt={username} className="blocked-avatar" />
      <div className="blocked-info">
        <h3>{username}</h3>
        <p className="why-block">Why did I block this user?</p>
        <p className="blocked-reason">{user.reason || "No reason provided."}</p>
      </div>
      <div className="unblock-section">
        <p>Unblock User?</p>
        <button className="unblock-btn" onClick={handleUnblock} disabled={loading}>
          {loading ? "Unblocking..." : "YES, UNBLOCK"}
        </button>
      </div>
    </div>
  );
}

export default BlockedUserCard;