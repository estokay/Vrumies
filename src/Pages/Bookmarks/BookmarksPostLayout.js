import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Components/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { FaComment } from 'react-icons/fa';
import './BookmarksPostLayout.css';
import useUserAverageRating from "../../Components/Reviews/useUserAverageRating";

function BookmarksPostLayout({ id, images, title, createdAt, userId }) {
  const [profilePic, setProfilePic] = useState(`${process.env.PUBLIC_URL}/default-profile.png`);
  const [username, setUsername] = useState("Unknown");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [postType, setPostType] = useState('event'); // default to event if unknown
  const averageRating = useUserAverageRating(userId);

  const formattedDate = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleDateString()
    : 'Date not available';

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

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postRef = doc(db, "Posts", id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setLikes(data.likesCounter || 0);
          setDislikes(data.dislikesCounter || 0);
          setTokens(data.tokens || 0);
          setPostType(data.type || 'event'); // dynamically set post type
        }

        const commentsSnap = await getDocs(collection(db, "Posts", id, "comments"));
        setCommentsCount(commentsSnap.size);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchPostData();
  }, [id]);

  // Determine the route based on post type
  const postRouteMap = {
    video: 'videopost',
    blog: 'blogpost',
    vehicle: 'vehiclepost',
    event: 'eventpost',
    market: 'marketpost',
    directory: 'directorypost',
    request: 'requestpost',
    loads: 'loadpost',
    trucks: 'truckpost',
    offer: 'offerpost'
  };

  const linkTo = `/${postRouteMap[postType] || 'eventpost'}/${id}`;

  return (
    <Link to={linkTo} className="events-post-layout">
      <div className="card-header">
        <div className="header-left">
          <img src={profilePic} alt="Creator" className="profile-pic" />
          <div className="creator-info">
            <p className="creator-name">{username}</p>
            <span className="date">{formattedDate}</span>
          </div>
        </div>
        <div className="header-right">
          <img 
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756830937/star_wvusn3.png" 
            alt="Star" 
            className="star-icon"
          />
          <span className="review-text">{averageRating > 0 ? averageRating.toFixed(1) : "N/A"}</span>
        </div>
      </div>

      <div className="thumbnail-container">
        <img
          src={images && images.length > 0 ? images[0] : `${process.env.PUBLIC_URL}/default-thumbnail.png`}
          alt={title || 'Post Thumbnail'}
          className="thumbnail"
        />
      </div>

      <h4 className="events-post-title">{(title || 'Untitled Event').toUpperCase()}</h4>

      <div className="card-footer">
        <div className="footer-left">
          <span className="footer-item">
            <img 
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756829309/like_elthi2.png"
              alt="Like"
              className="footer-icon custom-like"
            />
            {likes}
          </span>
          <span className="footer-item">
            <img 
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756829309/dislike_wivlom.png"
              alt="Dislike"
              className="footer-icon custom-dislike"
            />
            {dislikes}
          </span>
        </div>
        <div className="footer-right">
          <span className="footer-item">
            <img 
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756806527/Tokens-Icon_bhee9s.png" 
              alt="Tokens Icon" 
              className="footer-icon token-icon-small"
            />
            {tokens}
          </span>
          <span className="footer-item">
            <FaComment className="footer-icon comment" />
            {commentsCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BookmarksPostLayout;
