import React from "react";
import "./MyProfileSidePanel.css";
import { FaStar, FaPen, FaCamera, FaExpand } from "react-icons/fa";

export default function MyProfileSidePanel() {
  const profilePicUrl =
    "https://media.altphotos.com/cache/images/2017/07/04/07/752/portrait-man-dark.jpg";

  const handleChangeProfilePic = () => {
    alert("Change profile picture clicked");
  };

  return (
    <div className="mpsp-card">
      <div className="mpsp-image-wrapper">
        <img
          src={profilePicUrl}
          alt="Profile"
          className="mpsp-image"
        />

        <FaCamera
          className="mpsp-camera-icon"
          onClick={handleChangeProfilePic}
        />

        <FaExpand
          className="mpsp-maximize-icon"
          onClick={() => window.open(profilePicUrl, "_blank")}
        />
      </div>

      <div className="mpsp-name">
        <span className="mpsp-first-name">ALEX</span>{" "}
        <span className="mpsp-last-name">ANDERSON</span>
        <FaPen className="mpsp-edit-icon" />
      </div>

      <div className="mpsp-email">Anderson33@gmail.com</div>

      <div className="mpsp-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="mpsp-star" />
        ))}
      </div>

      <button className="mpsp-reviews-btn">Show All Reviews</button>

      <div className="mpsp-about-section">
        <div className="mpsp-about-header">
          <span>About me</span>
          <span className="mpsp-edit-about">Edit</span>
        </div>
        <p className="mpsp-about-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
          rhoncus dolor purus non enim praesent elementum facilisis leo, vel
          fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis
          enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra
          orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae
          tortor condimentum lacinia quis vel eros donec ac odio
        </p>
      </div>
    </div>
  );
}
