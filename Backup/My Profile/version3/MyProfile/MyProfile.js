import '../../App.css';
import '../../Components/Css/Profile.css';
import React, { useState } from "react";
import MyProfileSidePanel from './MyProfileSidePanel';
import MyProfileCategories from "./MyProfileCategories";
import MyProfileBody from "./MyProfileBody";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const [selectedCategory, setSelectedCategory] = useState("content"); // default

  return (
    <div className="content-page">
      <div className="my-profile">
        {/* Left side panel */}
        <div className="my-profile-sidepanel">
          <MyProfileSidePanel />
        </div>

        {/* Right side (categories + body stacked) */}
        <div className="my-profile-right">
          <div className="my-profile-section">
            {/* Top sub-navigation above categories */}
            <div className="profile-top-nav">
              <span className="top-nav-item selected">Posts</span>
              <span className="top-nav-item">Photos</span>
              <Link to="/myreviews" className="myreviews-top-nav-item">Reviews</Link>
            </div>

            {/* Categories grid */}
            <MyProfileCategories 
              selected={selectedCategory} 
              setSelected={setSelectedCategory} 
            />
          </div>

          <div className="my-profile-section">
            <MyProfileBody selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
