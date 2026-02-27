import React, { useState } from "react";
import "./CreateReview.css";
import { auth } from "../../Components/firebase";
import { useParams } from "react-router-dom";
import useGetUsername from "../../Hooks/useGetUsername";
import useGetProfilePic from "../../Hooks/useGetProfilePic";
import CreateUserReview from "../../Components/Reviews/CreateUserReview";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendNotificationReview from "../../Components/Notifications/SendNotificationReview";

export default function CreateReview() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submittedReview, setSubmittedReview] = useState(null);
  const { userId: sellerId } = useParams();
  const user = auth.currentUser;
  const currentUserId = user?.uid;
  const [notificationData, setNotificationData] = useState(null);

  const handleReviewSuccess = () => {
    if (!submittedReview) return;

    setNotificationData({
      sellerId,
      fromId: currentUserId,
      stars: submittedReview.rating,
      reviewComment: submittedReview.comment,
    });

    toast.success("Review submitted successfully! ⭐");
    setSubmittedReview(null);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;

    // Prevent user from reviewing themselves
    if (sellerId === currentUserId) {
      toast.error("You can't review yourself ❌");
      return;
    }

    setSubmittedReview({
      sellerId,
      rating,
      comment: text.trim(),
    });

    //alert(`Review submitted: ${text} with rating: ${rating} ⭐`);
    setText("");
    setRating(0);
    setHover(0);


  };

  const username = useGetUsername(currentUserId);
  const avatar = useGetProfilePic(currentUserId);

  const realUser = {
    name: username,
    avatar: avatar,
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
          <img src={realUser.avatar} alt="avatar" className="cr-avatar" />
          <div className="cr-user-text">
            <span className="cr-username">{realUser.name}</span>
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

      {/* Trigger Firestore write */}
      {submittedReview && (
        <CreateUserReview
          sellerId={submittedReview.sellerId}
          rating={submittedReview.rating}
          comment={submittedReview.comment}
          onSuccess={handleReviewSuccess} // pass callback
        />
      )}

      {notificationData && (
        <SendNotificationReview
          sellerId={notificationData.sellerId}
          fromId={notificationData.fromId}
          stars={notificationData.stars}
          reviewComment={notificationData.reviewComment}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
}
