import React, { useState } from "react";
import '../../App.css';
import './Reviews.css';
import MyProfileSidePanel from '../MyProfile/MyProfileSidePanel';
import MyReviewsCategories from "./MyReviewsCategories";
import MyReviewsBody from "./MyReviewsBody";
import CreateReview from "./CreateReview"; // <-- new component
import { Link } from "react-router-dom";

const MyReviews = () => {
  const [selectedCategory, setSelectedCategory] = useState("content"); // default

  return (
    <div className="content-page">
      <div className="myreviews-profile">
        {/* Left side panel */}
        <div className="myreviews-profile-sidepanel">
          <MyProfileSidePanel />
        </div>

        {/* Right side (stacked sections) */}
        <div className="myreviews-profile-right">
          <div className="myreviews-profile-section">
            {/* Top sub-navigation above categories */}
            <div className="myreviews-top-nav">
              <Link to="/myprofile" className="myreviews-top-nav-item">Posts</Link>
              <Link to="/myphotos" className="myreviews-top-nav-item">Photos</Link>
              <span className="myreviews-top-nav-item selected">Reviews</span>
            </div>

            {/* Reviews summary */}
            <MyReviewsCategories 
              selected={selectedCategory} 
              setSelected={setSelectedCategory} 
            />
          </div>

          {/* Create Review */}
          <div className="myreviews-profile-section">
            <CreateReview />
          </div>

          {/* Reviews list */}
          <div className="myreviews-profile-section">
            <MyReviewsBody selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
