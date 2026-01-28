import React, { useState, useEffect } from "react";
import "./ViewProfileSidePanel.css";
import { FaStar, FaExpand } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { db } from "../../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ProfileRating from "../../Components/Reviews/ProfileRating";

const ViewProfileSidePanel = () => {
  const { userId } = useParams(); // Grab the userId from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Query Users collection where "userid" field matches the URL
        const q = query(collection(db, "Users"), where("userid", "==", userId));
        const snap = await getDocs(q);

        if (!snap.empty) {
          setUser(snap.docs[0].data());
        } else {
          console.warn("User not found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const toggleFollow = () => setIsFollowing(!isFollowing);

  if (loading)
    return (
      <div className="vpsp-profile-card">
        <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
      </div>
    );

  if (!user)
    return (
      <div className="vpsp-profile-card">
        <p style={{ color: "white", textAlign: "center" }}>User not found</p>
      </div>
    );

  return (
    <div className="vpsp-profile-card">
      {/* Profile image */}
      <div className="vpsp-profile-image-wrapper">
        <img
          src={user.profilepic || "https://via.placeholder.com/150"}
          alt={user.username}
          className="vpsp-profile-image"
        />
        <FaExpand
          className="vpsp-maximize-icon"
          onClick={() => window.open(user.profilepic, "_blank")}
        />
      </div>

      {/* Username */}
      <div className="vpsp-profile-name">
        <span className="vpsp-first-name">{user.username}</span>
      </div>

      {/* Email */}
      <div className="vpsp-profile-email">{user.email}</div>

      {/* Stars */}
      <div className="vpsp-stars">
        <ProfileRating userId={userId} />
      </div>

      {/* Buttons */}
      <div className="vpsp-button-stack">
        <button
          className={`vpsp-action-btn vpsp-follow-btn ${
            isFollowing ? "following" : ""
          }`}
          onClick={toggleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
        <button className="vpsp-action-btn">Message Me</button>
        <button className="vpsp-action-btn">Share Profile</button>
      </div>

      {/* About section */}
      <div className="vpsp-about-section">
        <div className="vpsp-about-header">About me</div>
        <p className="vpsp-about-text">
          {user.aboutme && user.aboutme.trim() !== ""
            ? user.aboutme
            : "No bio yet."}
        </p>
      </div>
    </div>
  );
};

export default ViewProfileSidePanel;
