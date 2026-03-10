import React from "react";
import { Link } from "react-router-dom";
import { FaUserFriends, FaStar } from "react-icons/fa";
import './ProfileCardLayout.css';

function ProfileCardLayout({ user }) {
  const profilePic = user?.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`;
  const username = user?.username || "Unknown User";
  const aboutMe = user?.aboutme || "No bio available.";
  const averageRating = user?.averageRating ?? 0;
  const totalRatings = user?.totalRatings ?? 0;
  const followersCount = user?.followers?.length ?? 0;

  return (
    <Link to={`/viewprofile/${user?.userid || ""}`} className="profile-card-layout">
      
      {/* Card Top / Header */}
      <div className="profile-card-top">
        {/* Background image behind avatar */}
        <img
          src={user?.profilecover || `${process.env.PUBLIC_URL}/small-bg.png`}
          alt="Background"
          className="profile-card-bg-image"
        />
        
        
      </div>
      <img src={profilePic} alt={username} className="profile-card-avatar" />  
      {/*<div className="profile-card-top">
        <img src={profilePic} alt={username} className="profile-card-avatar" />
      </div> */}

      {/* Username and About */}
      <div className="profile-card-body">
        <p className="profile-card-username">{username}</p>
        <p className="profile-card-about">{aboutMe.length > 60 ? aboutMe.slice(0, 57) + "..." : aboutMe}</p>
      </div>

      {/* Footer with tokens & followers */}
      <div className="profile-card-footer">
        <div className="footer-item">
          <FaStar className="footer-icon star-icon" />
          <span>{averageRating.toFixed(1)} ({totalRatings})</span>
        </div>
        <div className="footer-item">
          <FaUserFriends className="footer-icon" />
          {followersCount}
        </div>
      </div>
    </Link>
  );
}

export default ProfileCardLayout;