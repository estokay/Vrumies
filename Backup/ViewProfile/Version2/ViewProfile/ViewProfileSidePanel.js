import React, { useState } from "react";
import "./ViewProfileSidePanel.css";
import { FaStar, FaExpand } from "react-icons/fa";

const ViewProfileSidePanel = () => {
  const [isFollowing, setIsFollowing] = useState(false); // State for follow button

  const profilePicUrl =
    "https://media.altphotos.com/cache/images/2017/07/04/07/752/portrait-man-dark.jpg";

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="vpsp-profile-card">
      {/* Profile image */}
      <div className="vpsp-profile-image-wrapper">
        <img
          src={profilePicUrl}
          alt="Profile"
          className="vpsp-profile-image"
        />
        <FaExpand
          className="vpsp-maximize-icon"
          onClick={() => window.open(profilePicUrl, "_blank")}
        />
      </div>

      {/* Name */}
      <div className="vpsp-profile-name">
        <span className="vpsp-first-name">Wendy</span>
        <span className="vpsp-last-name">Florence</span>
      </div>

      {/* Email */}
      <div className="vpsp-profile-email">florencewendy32@gmail.com</div>

      {/* Stars */}
      <div className="vpsp-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="vpsp-star" />
        ))}
      </div>

      {/* Buttons stacked vertically */}
      <div className="vpsp-button-stack">
        <button
          className={`vpsp-action-btn vpsp-follow-btn ${
            isFollowing ? "following" : ""
          }`}
          onClick={toggleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
        <button className="vpsp-action-btn">Message Me</button>
        <button className="vpsp-action-btn">View Reviews</button>
      </div>

      {/* About section */}
      <div className="vpsp-about-section">
        <div className="vpsp-about-header">About me</div>
        <p className="vpsp-about-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
          rhoncus dolor purus non enim praesent elementum facilisis leo, vel
          fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis
          enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra
          orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae
          tortor condimentum lacinia quis vel eros donec ac odio.
        </p>
      </div>
    </div>
  );
};

export default ViewProfileSidePanel;
