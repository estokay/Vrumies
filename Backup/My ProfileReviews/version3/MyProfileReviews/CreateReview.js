import React, { useState } from "react";
import "./CreateReview.css";

export default function CreateReview() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = () => {
    if (!text.trim()) return;
    alert(`Review submitted: ${text} with rating: ${rating} ⭐`);
    setText("");
    setRating(0);
    setHover(0);
  };

  // Dummy user data
  const dummyUser = {
    name: "Alex Anderson",
    avatar: "https://i.pravatar.cc/150?img=32",
  };

  const currentDate = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="cr-container">
      {/* Title */}
      <h2 className="cr-title">Create Review</h2>

      {/* Top row: user info left, stars right */}
      <div className="cr-top-row">
        <div className="cr-user-info">
          <img src={dummyUser.avatar} alt="avatar" className="cr-avatar" />
          <div className="cr-user-text">
            <span className="cr-username">{dummyUser.name}</span>
            <span className="cr-date">{currentDate}</span>
          </div>
        </div>

        <div className="cr-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < (hover || rating) ? "cr-star-filled" : "cr-star-empty"}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Review textarea */}
      <textarea
        className="cr-textarea"
        placeholder="Type your comment here..."
        maxLength={130}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="cr-actions">
        <span className="cr-char-limit">Maximum Characters Allowed: 130</span>
        <button className="cr-submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
