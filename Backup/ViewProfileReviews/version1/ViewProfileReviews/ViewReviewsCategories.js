import React from "react";
import "./ReviewsCategories.css";

export default function ViewReviewsCategories() {
  return (
    <div className="myreviews-categories-grid myreviews-reviews-summary">

      <div className="myreviews-review-summary-item">
        <div className="myreviews-review-summary-number">4.25 / 5 ⭐</div>
        <div className="myreviews-review-summary-label">Average Reviews</div>
      </div>

      <div className="myreviews-review-summary-item">
        <div className="myreviews-review-summary-number">526</div>
        <div className="myreviews-review-summary-label">Total Reviews</div>
      </div>

      <div className="myreviews-review-summary-item">
        <div className="myreviews-review-summary-number">7</div>
        <div className="myreviews-review-summary-label">Disputes</div>
      </div>

    </div>
  );
}
