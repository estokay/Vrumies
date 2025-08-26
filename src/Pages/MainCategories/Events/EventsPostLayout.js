import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../../Components/firebase'; // adjust path if needed
import { doc, getDoc } from 'firebase/firestore';
import './EventsPostLayout.css';

function EventsPostLayout({ id, images, title, createdAt, userId }) {
  const [profilePic, setProfilePic] = useState(`${process.env.PUBLIC_URL}/default-profile.png`);
  const [username, setUsername] = useState("Unknown");

  // Convert Firestore timestamp to a readable date
  const formattedDate = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleDateString()
    : 'Date not available';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        // 🔹 Grab the specific user document
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUsername(data.username || "Unknown");
          setProfilePic(data.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <Link to={`/eventpost/${id}`} className="events-post-layout">
      <div className="card-header">
        <div className="header-left">
          <img
            src={profilePic}
            alt="Creator"
            className="profile-pic"
          />
          <div className="creator-info">
            <p className="creator-name">{username}</p>
            <p className="date">{formattedDate}</p>
          </div>
        </div>
        <span className="points">0 <span className="star">⭐</span></span>
      </div>

      <div className="thumbnail-container">
        <img
          src={images && images.length > 0 ? images[0] : `${process.env.PUBLIC_URL}/default-thumbnail.png`}
          alt={title || 'Event Thumbnail'}
          className="thumbnail"
        />
      </div>

      <h4 className="events-post-title">
        {(title || 'Untitled Event').toUpperCase()}
      </h4>

      <div className="card-footer">
        <span className="likes">
          <img src={`${process.env.PUBLIC_URL}/like.png`} alt="Likes" />
          0
        </span>
        <span className="comments">
          <img src={`${process.env.PUBLIC_URL}/comment.jpg`} alt="Comments" />
          0
        </span>
      </div>
    </Link>
  );
}

export default EventsPostLayout;
