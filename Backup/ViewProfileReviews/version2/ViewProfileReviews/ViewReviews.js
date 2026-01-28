import React, { useState } from "react";
import '../../App.css';
import './Reviews.css';
import ViewProfileSidePanel from '../ViewProfile/ViewProfileSidePanel';
import ViewReviewsCategories from "./ViewReviewsCategories";
import ViewReviewsBody from "./ViewReviewsBody";
import CreateReview from "./CreateReview"; // <-- new component
import { useParams, Link } from "react-router-dom";

const ViewReviews = () => {
  const { userId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("content"); // default

  return (
    <div className="content-page">
      <div className="myreviews-profile">
        {/* Left side panel */}
        <div className="myreviews-profile-sidepanel">
          <ViewProfileSidePanel />
        </div>

        {/* Right side (stacked sections) */}
        <div className="myreviews-profile-right">
          <div className="myreviews-profile-section">
            {/* Top sub-navigation above categories */}
            <div className="myreviews-top-nav">
              <Link to={`/viewprofile/${userId}`} className="myreviews-top-nav-item">Posts</Link>
              <Link to={`/viewphotos/${userId}`} className="myreviews-top-nav-item">Photos</Link>
              <span className="myreviews-top-nav-item selected">Reviews</span>
            </div>

            {/* Reviews summary */}
            <ViewReviewsCategories 
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
            <ViewReviewsBody selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReviews;
