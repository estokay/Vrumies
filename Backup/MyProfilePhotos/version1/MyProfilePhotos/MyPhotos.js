import '../../App.css';
import './Photos.css';
import React, { useState } from "react";
import MyProfileSidePanel from '../MyProfile/MyProfileSidePanel';
import MyPhotosCategories from "./MyPhotosCategories";
import MyPhotosBody from "./MyPhotosBody";
import { Link } from "react-router-dom";

const MyPhotos = () => {
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
              <Link to="/myprofile" className="myreviews-top-nav-item">Posts</Link>
              <span className="top-nav-item selected">Photos</span>
              <Link to="/myreviews" className="myreviews-top-nav-item">Reviews</Link>
            </div>

            {/* Categories grid */}
            <MyPhotosCategories 
              selected={selectedCategory} 
              setSelected={setSelectedCategory} 
            />
          </div>

          <div className="my-profile-section">
            <MyPhotosBody selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPhotos;
