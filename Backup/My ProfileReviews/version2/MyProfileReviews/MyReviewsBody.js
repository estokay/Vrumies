import React from "react";
import "./ReviewsBody.css";

export default function MyReviewsBody() {
  // ---- DUMMY DATA ----
  const reviews = [
    {
      id: 2,
      userName: "MICHAEL DARIUS",
      userPhoto: "https://i.pravatar.cc/150?img=13",
      rating: 5,
      date: "MARCH 29, 2022",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet. Est, tellus pharetra, dictum donec laoreet in feugiat leo.",
    },
    {
      id: 3,
      userName: "FRANK MEEK",
      userPhoto: "https://i.pravatar.cc/150?img=56",
      rating: 4,
      date: "MARCH 29, 2022",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet.",
    },
    {
      id: 4,
      userName: "STEPHEN DARIUS",
      userPhoto: "https://i.pravatar.cc/150?img=24",
      rating: 5,
      date: "MARCH 29, 2022",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet.",
    },
  ];

  return (
    <div className="myreviews-profile-body">
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
