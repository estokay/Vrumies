import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
import './EventsPostLayout.css';

function EventsPostLayout({ id, images, title, createdAt, userId }) {
  const [profilePic, setProfilePic] = useState(`${process.env.PUBLIC_URL}/default-profile.png`);
  const [username, setUsername] = useState("Unknown");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [tokens, setTokens] = useState(0); // new state for tokens

  const formattedDate = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleDateString()
    : 'Date not available';

  // Fetch creator info
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
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

  // Fetch likesCounter, dislikesCounter, comments count, and tokens
  useEffect(() => {
    const fetchPostStats = async () => {
      try {
        const postRef = doc(db, "Posts", id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setLikes(data.likesCounter || 0);
          setDislikes(data.dislikesCounter || 0);
          setTokens(data.tokens || 0); // fetch tokens
        }

        const commentsSnap = await getDocs(collection(db, "Posts", id, "comments"));
        setCommentsCount(commentsSnap.size);
      } catch (error) {
        console.error("Error fetching post stats:", error);
      }
    };

    fetchPostStats();
  }, [id]);

  return (
    <Link to={`/eventpost/${id}`} className="events-post-layout">
      <div className="card-header">
        <div className="header-left">
          <img src={profilePic} alt="Creator" className="profile-pic" />
          <div className="creator-info">
            <p className="creator-name">{username}</p>
            <p className="date">{formattedDate}</p>
          </div>
        </div>
        {/* Keep tokens in the top right exactly as before */}
        <span className="points">{tokens} <span className="star">⭐</span></span>
      </div>

      <div className="thumbnail-container">
        <img
          src={images && images.length > 0 ? images[0] : `${process.env.PUBLIC_URL}/default-thumbnail.png`}
          alt={title || 'Event Thumbnail'}
          className="thumbnail"
        />
      </div>

      <h4 className="events-post-title">{(title || 'Untitled Event').toUpperCase()}</h4>

      <div className="card-footer">
        <div className="footer-left">
          <span className="footer-item">
            <FaThumbsUp className="footer-icon like" />
            {likes}
          </span>
          <span className="footer-item">
            <FaThumbsDown className="footer-icon dislike" />
            {dislikes}
          </span>
        </div>
        <span className="footer-item">
          <FaComment className="footer-icon comment" />
          {commentsCount}
        </span>
      </div>
    </Link>
  );
}

export default EventsPostLayout;
