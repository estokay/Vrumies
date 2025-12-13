import React from "react";
import "./ReviewsCategories.css";

export default function MyReviewsCategories() {
  return (
    <div className="profile-categories-grid profile-reviews-summary">

      <div className="review-summary-item">
        <div className="review-summary-number">4.25 / 5 ⭐</div>
        <div className="review-summary-label">Average Reviews</div>
      </div>

      <div className="review-summary-item">
        <div className="review-summary-number">526</div>
        <div className="review-summary-label">Total Reviews</div>
      </div>

      <div className="review-summary-item">
        <div className="review-summary-number">7</div>
        <div className="review-summary-label">Disputes</div>
      </div>

    </div>
  );
}
