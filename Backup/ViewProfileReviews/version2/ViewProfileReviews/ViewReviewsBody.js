import React from "react";
import "./ReviewsBody.css";

export default function ViewReviewsBody() {
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
    {
      id: 5,
      userName: "JAMES SMITH",
      userPhoto: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      date: "APRIL 5, 2022",
      text:
        "Suspendisse potenti. Sed dignissim, metus nec fringilla ultricies, sapien justo posuere libero, ut lacinia orci nunc ut sapien.",
    },
    {
      id: 6,
      userName: "LINDA JOHNSON",
      userPhoto: "https://i.pravatar.cc/150?img=7",
      rating: 3,
      date: "APRIL 8, 2022",
      text:
        "Curabitur vel sem at lorem placerat varius. Integer ac felis in lectus malesuada viverra.",
    },
    {
      id: 7,
      userName: "DAVID CLARK",
      userPhoto: "https://i.pravatar.cc/150?img=15",
      rating: 5,
      date: "APRIL 10, 2022",
      text:
        "Fusce non magna ut libero posuere consequat. Sed bibendum justo at sem volutpat, a aliquam justo suscipit.",
    },
    {
      id: 8,
      userName: "EMILY WRIGHT",
      userPhoto: "https://i.pravatar.cc/150?img=20",
      rating: 4,
      date: "APRIL 12, 2022",
      text:
        "Nam nec ex non neque pharetra posuere. Proin ac elit eu lacus lacinia malesuada.",
    },
    {
      id: 9,
      userName: "ROBERT HALL",
      userPhoto: "https://i.pravatar.cc/150?img=18",
      rating: 5,
      date: "APRIL 15, 2022",
      text:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec et lorem ut risus congue tristique.",
    },
    {
      id: 10,
      userName: "NICOLE BROWN",
      userPhoto: "https://i.pravatar.cc/150?img=25",
      rating: 4,
      date: "APRIL 18, 2022",
      text:
        "Praesent euismod sapien in libero consequat, a interdum justo cursus. Integer in dolor vel justo aliquam volutpat.",
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
