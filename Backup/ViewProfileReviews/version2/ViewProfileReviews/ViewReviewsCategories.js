import React from "react";
import "./ReviewsCategories.css";
import { useParams } from "react-router-dom";
import useUserAverageRating from "../../Components/Reviews/useUserAverageRating";
import useUserTotalRatings from "../../Components/Reviews/useUserTotalRatings";
import useGetUserDisputes from "../../Components/Hooks/useGetUserDisputes";

export default function ViewReviewsCategories() {
  const { userId } = useParams();

  const averageRating = useUserAverageRating(userId);
  const totalRatings = useUserTotalRatings(userId);
  const disputes = useGetUserDisputes(userId);

  

  const showAverageRating = () => {
    if (!userId) return "—";
    if (totalRatings === null) return "Loading...";
    if (totalRatings === 0) return "N/A";
    if (averageRating === null) return "Loading...";

    const formattedRating = Number(averageRating || 0).toFixed(1);
    return `${formattedRating} / 5 ⭐`;
  };

  const showTotalRatings = () => {
    if (!userId) return "—";
    if (totalRatings === null) return "Loading...";
    return totalRatings;
  };

  const showDisputes = () => {
    if (!userId) return "—";
    if (disputes === null) return "Loading...";
    return disputes;
  };

  return (
    <div className="myreviews-categories-grid myreviews-reviews-summary">

      <div className="myreviews-review-summary-item">
        <div className="myreviews-review-summary-number">
          {showAverageRating()}
        </div>
        <div className="myreviews-review-summary-label">
          Average Rating
        </div>
      </div>

      <div className="myreviews-review-summary-item">
        <div className="myreviews-review-summary-number">
          {showTotalRatings()}
        </div>
        <div className="myreviews-review-summary-label">
          Total Reviews
        </div>
      </div>

      <div className="myreviews-review-summary-item">
        <div className="myreviews-review-summary-number">
          {showDisputes()}
        </div>
        <div className="myreviews-review-summary-label">
          Disputes
        </div>
      </div>

    </div>
  );
}