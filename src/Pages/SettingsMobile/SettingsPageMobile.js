import React, { useState, useEffect } from "react";
import { FaCode, FaUserTie, FaLifeRing, FaDesktop } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../AuthContext";
import { useGetUserReferralCode } from "../../Hooks/useGetUserReferralCode";
import useGetBlockedList from "../../Hooks/useGetBlockedList";
import useUnblockUser from "../../Hooks/useUnblockUser";
import useGetUsername from "../../Hooks/useGetUsername";
import useGetProfilePic from "../../Hooks/useGetProfilePic";
import PageHeader from '../../Components/PageHeader';
import "./SettingsPageMobile.css";
import "react-toastify/dist/ReactToastify.css";
import ViewMode from "../Settings/ViewMode";

const SettingsPageMobile = () => {
  const [activeTab, setActiveTab] = useState("referral");
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  // --- REFERRAL LOGIC ---
  const { referralCode, loading: refLoading, error: refError } = useGetUserReferralCode();
  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!");
    }
  };

  // --- BLOCKED USERS LOGIC ---
  const { blockedList: fetchedList, loading: listLoading, error: listError } = useGetBlockedList(userId);
  const [localBlockedList, setLocalBlockedList] = useState([]);
  
  useEffect(() => {
    if (fetchedList) setLocalBlockedList(fetchedList);
  }, [fetchedList]);

  const handleUnblocked = (id) => {
    setLocalBlockedList((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="vrm-mobile-settings-wrapper">
      <PageHeader 
        title="Settings" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1772138760/blue-gears-machinery-vector_ad0ucz.jpg" 
      />

      {/* MOBILE NAVIGATION TABS */}
      <div className="vrm-mobile-tabs-nav">
        <button 
          className={`vrm-nav-item ${activeTab === "referral" ? "vrm-active" : ""}`}
          onClick={() => setActiveTab("referral")}
        >
          <FaCode />
          <span>Code</span>
        </button>
        <button 
          className={`vrm-nav-item ${activeTab === "blocked" ? "vrm-active" : ""}`}
          onClick={() => setActiveTab("blocked")}
        >
          <FaUserTie />
          <span>Blocked</span>
        </button>
        <button 
          className={`vrm-nav-item ${activeTab === "viewMode" ? "vrm-active" : ""}`}
          onClick={() => setActiveTab("viewMode")}
        >
          <FaDesktop /> {/* icon for view mode */}
          <span>View Mode</span>
        </button>
        <button 
          className={`vrm-nav-item ${activeTab === "help" ? "vrm-active" : ""}`}
          onClick={() => setActiveTab("help")}
        >
          <FaLifeRing />
          <span>Help</span>
        </button>
      </div>

      <div className="vrm-mobile-content-container">
        {/* REFERRAL SECTION */}
        {activeTab === "referral" && (
          <div className="vrm-mob-referral-view">
            <h3 className="vrm-mob-section-title">Your Referral Code</h3>
            <div className="vrm-mob-code-display">
              {refLoading ? "..." : refError ? "Error" : referralCode || "N/A"}
            </div>
            <button className="vrm-mob-action-btn" onClick={handleCopy}>Copy Code</button>
          </div>
        )}

        {/* BLOCKED USERS SECTION */}
        {activeTab === "blocked" && (
          <div className="vrm-mob-blocked-view">
            <h3 className="vrm-mob-section-title">Blocked Users</h3>
            {!currentUser && <p>Please log in.</p>}
            {listLoading && <p>Loading...</p>}
            {localBlockedList.length === 0 && !listLoading && <p>No users blocked.</p>}
            {localBlockedList.map((user) => (
              <MobileBlockedCard key={user.id} user={user} onUnblocked={handleUnblocked} />
            ))}
          </div>
        )}

        {/* VIEW MODE SECTION */}
        {activeTab === "viewMode" && (
          <div className="vrm-mob-viewmode-view">
            <h3 className="vrm-mob-section-title">View Mode Options</h3>
            <ViewMode />
          </div>
        )}

        {/* HELP SECTION */}
        {activeTab === "help" && (
          <div className="vrm-mob-help-view">
            <h3 className="vrm-mob-section-title">Support</h3>
            <p className="vrm-mob-help-text">Need assistance? Contact us at:</p>
            <div className="vrm-mob-contact-box">vrumies@gmail.com</div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
};

// Sub-component for individual cards to keep clean
const MobileBlockedCard = ({ user, onUnblocked }) => {
  const { unblockUser, loading } = useUnblockUser();
  const username = useGetUsername(user.id);
  const profilePic = useGetProfilePic(user.id);

  const handleUnblock = async () => {
    try {
      await unblockUser(user.id);
      toast.success(`${username} unblocked!`);
      onUnblocked(user.id);
    } catch (err) {
      toast.error("Failed to unblock");
    }
  };

  return (
    <div className="vrm-mob-user-card">
      <img src={profilePic} alt="User" className="vrm-mob-avatar" />
      <div className="vrm-mob-card-info">
        <span className="vrm-mob-username">{username}</span>
        <span className="vrm-mob-reason-label">Reason:</span>
        <p className="vrm-mob-reason-text">{user.reason || "None"}</p>
      </div>
      <button className="vrm-mob-unblock-btn" onClick={handleUnblock} disabled={loading}>
        {loading ? "..." : "UNBLOCK"}
      </button>
    </div>
  );
};

export default SettingsPageMobile;