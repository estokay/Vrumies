import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import useUserAverageRating from "./useUserAverageRating";
import useUserTotalRatings from "./useUserTotalRatings";

function SellerRating({ userId }) {
  // Get average and total reviews from your hooks
  const avgRating = useUserAverageRating(userId) || 0; // e.g., 4.3
  const totalRatings = useUserTotalRatings(userId) || 0; // e.g., 128

  // Round to nearest 0.5 for star display
  const roundedRating = Math.round(avgRating * 2) / 2;

  return (
    <div className="seller-reviews">
      {/* Render 5 stars */}
      {[...Array(5)].map((_, i) => {
        if (roundedRating >= i + 1) {
          return <FaStar key={i} color="#f6c61d" />;
        } else if (roundedRating >= i + 0.5) {
          return <FaStarHalfAlt key={i} color="#f6c61d" />;
        } else {
          return <FaStar key={i} color="#ccc" />;
        }
      })}

      {/* Show numeric rating and total reviews */}
      <span className="review-count" style={{ marginLeft: "0.5rem" }}>
        {avgRating.toFixed(1)} ({totalRatings} review{totalRatings !== 1 ? "s" : ""})
      </span>
    </div>
  );
}

export default SellerRating;