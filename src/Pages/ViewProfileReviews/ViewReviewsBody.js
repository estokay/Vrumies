import React from "react";
import "./ReviewsBody.css";
import useUserReviews from "../../Components/Hooks/useGetUserReviews";
import { useParams } from "react-router-dom";

export default function ViewReviewsBody() {
  const { userId } = useParams();

  const { reviews, loading } = useUserReviews(userId);

  return (
    <div className="myreviews-profile-body">
      {/* Loading state */}
      {loading && <p className="myreviews-message">Loading reviews...</p>}

      {/* Empty state */}
      {!loading && reviews.length === 0 && <p className="myreviews-message">No reviews yet.</p>}

      {/* ==== REVIEWS ==== */}
      {reviews.map((review) => (
        <div key={review.id} className="myreviews-review-card">
          <div className="myreviews-review-top">
            <img src={review.userPhoto} alt="" className="myreviews-review-avatar" />
            <div className="myreviews-review-user-info">
              <span className="myreviews-review-username">{review.userName}</span>
              <span className="myreviews-review-date">{review.date}</span>
            </div>
            <div className="myreviews-review-rating">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="myreviews-star-filled">★</span>
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <span key={i} className="myreviews-star-empty">★</span>
              ))}
            </div>
          </div>

          <p className="myreviews-review-text">{review.text}</p>
          <div className="myreviews-review-line" />
        </div>
      ))}
    </div>
  );
}
