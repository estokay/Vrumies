import React from "react";
import "./ReviewsBody.css";

export default function MyReviewsBody() {
  // ---- DUMMY DATA ----
  const reviews = [
    {
      id: 1,
      userName: "Alex Anderson",
      userPhoto:
        "https://i.pravatar.cc/150?img=32",
      rating: 4,
      date: "MARCH 29, 2022",
      text: "",
      isWriteReview: true,
    },
    {
      id: 2,
      userName: "MICHAEL DARIUS",
      userPhoto:
        "https://i.pravatar.cc/150?img=13",
      rating: 5,
      date: "MARCH 29, 2022",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet. Est, tellus pharetra, dictum donec laoreet in feugiat leo.",
    },
    {
      id: 3,
      userName: "FRANK MEEK",
      userPhoto:
        "https://i.pravatar.cc/150?img=56",
      rating: 4,
      date: "MARCH 29, 2022",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet.",
    },
    {
      id: 4,
      userName: "STEPHEN DARIUS",
      userPhoto:
        "https://i.pravatar.cc/150?img=24",
      rating: 5,
      date: "MARCH 29, 2022",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet.",
    },
  ];

  return (
    <div className="my-profile-body">

      {/* ==== REVIEWS ==== */}
      {reviews.map((review) => (
        <div key={review.id} className="review-card">

          <div className="review-top">
            <img src={review.userPhoto} alt="" className="review-avatar" />

            <div className="review-user-info">
              <span className="review-username">{review.userName}</span>
              <span className="review-date">{review.date}</span>
            </div>

            <div className="review-rating">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="star-filled">★</span>
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <span key={i} className="star-empty">★</span>
              ))}
            </div>
          </div>

          {/* If this is the "write a review" block */}
          {review.isWriteReview ? (
            <div className="write-review-box">
              <textarea
                className="review-textarea"
                placeholder="Type your comment here..."
                maxLength={130}
              />
              <div className="review-actions">
                <span className="char-limit-text">
                  Maximum Characters Allowed: 130
                </span>
                <button className="submit-review-btn">Submit</button>
              </div>
            </div>
          ) : (
            <p className="review-text">{review.text}</p>
          )}

          <div className="review-line" />
        </div>
      ))}
    </div>
  );
}
