import React from "react";
import "./PostSectionReviews.css";
import useUserReviews from "../Hooks/useGetUserReviews";

export default function PostSectionReviews({ userId }) {
  const { reviews, loading } = useUserReviews(userId);

  if (!userId) {
    return <p className="postreviews-message">Seller not found.</p>;
  }

  return (
    <div className="postreviews-container">
      {/* Loading */}
      {loading && (
        <p className="postreviews-message">Loading reviews...</p>
      )}

      {/* Empty */}
      {!loading && reviews.length === 0 && (
        <p className="postreviews-message">No reviews yet.</p>
      )}

      {/* Reviews */}
      {!loading &&
        reviews.map((review) => (
          <div key={review.id} className="postreviews-card">
            <div className="postreviews-top">
              <img
                src={review.userPhoto}
                alt=""
                className="postreviews-avatar"
              />

              <div className="postreviews-user-info">
                <span className="postreviews-username">
                  {review.userName}
                </span>
                <span className="postreviews-date">
                  {review.date}
                </span>
              </div>

              <div className="postreviews-rating">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={`f-${i}`} className="postreviews-star-filled">
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, i) => (
                  <span key={`e-${i}`} className="postreviews-star-empty">
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="postreviews-text">{review.text}</p>
            <div className="postreviews-divider" />
          </div>
        ))}
    </div>
  );
}