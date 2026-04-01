import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaEnvelope,
  FaPlus,
  FaClipboard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import useGetProfilePic from "../../Hooks/useGetProfilePic";
import "./MobileNavbarBottom.css";
import ProfileMenu from "./ProfileMenu";
import CreatePostOverlayMobile from "../../CreatePostMobile/CreatePostOverlayMobile";

const MobileNavbarBottom = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const profilePic = useGetProfilePic(userId);

  const [showCreatePostOverlay, setShowCreatePostOverlay] = useState(false);

  return (
    <>
      <div className="mobile-navbar-wrapper">

        <nav className="mobile-navbar">

          <button
            className="mobile-nav-btn"
            onClick={() => navigate("/homemobile")}
          >
            <FaHome />
            <span className="mobile-nav-label">Home</span>
          </button>

          <button
            className="mobile-nav-btn"
            onClick={() => navigate("/inboxmobile")}
          >
            <FaEnvelope />
            <span className="mobile-nav-label">Messages</span>
          </button>

          <div className="nav-gap"></div>

          <button
            className="mobile-nav-btn"
            onClick={() => navigate("/ordersmobile")}
          >
            <FaClipboard />
            <span className="mobile-nav-label">Orders</span>
          </button>

          <div className="profile-wrapper">
            <button
              className="mobile-nav-btn"
              onClick={() => navigate("/myprofilemobile")}
            >
              <img
                src={profilePic}
                alt="User"
                className="mobile-nav-profile-pic"
                onError={(e) => {
                  e.target.src = `${process.env.PUBLIC_URL}/default-profile.png`;
                }}
              />
              <span className="mobile-nav-label">Profile</span>
            </button>
            
            

          </div>
        </nav>

        

        

        {/* CREATE BUTTON */}
        <div className="create-post-wrapper">
          <button
            className="create-post-btn"
            onClick={() => {
              setShowCreatePostOverlay(true);
            }}
          >
            <FaPlus />
          </button>

          <span className="create-post-label">Create Post</span>
        </div>

      </div>

      {showCreatePostOverlay && (
        <CreatePostOverlayMobile
          isOpen={showCreatePostOverlay}
          onClose={() => setShowCreatePostOverlay(false)}
        />
      )}
    </>
  );
};

export default MobileNavbarBottom;