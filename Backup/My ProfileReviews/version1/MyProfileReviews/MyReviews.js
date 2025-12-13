import '../../App.css';
import './Reviews.css';
import React, { useState } from "react";
import MyProfileSidePanel from '../MyProfile/MyProfileSidePanel';
import MyReviewsCategories from "./MyReviewsCategories";
import MyReviewsBody from "./MyReviewsBody";

const MyReviews = () => {
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
              <span className="top-nav-item">Posts</span>
              <span className="top-nav-item">Photos</span>
              <span className="top-nav-item selected">Reviews</span>
            </div>

            {/* Categories grid */}
            <MyReviewsCategories 
              selected={selectedCategory} 
              setSelected={setSelectedCategory} 
            />
          </div>

          <div className="my-profile-section">
            <MyReviewsBody selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
