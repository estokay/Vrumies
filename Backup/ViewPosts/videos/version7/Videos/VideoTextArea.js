import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';
import { Share2, Bookmark, Flag } from 'lucide-react';
import './VideoTextArea.css';

const VideoTextArea = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Unknown');
  const [userImage, setUserImage] = useState(`${process.env.PUBLIC_URL}/default-profile.png`);
  const [userReviews, setUserReviews] = useState(0);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    alert(`Messaging ${userName}...`);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists() && postSnap.data().type === 'video') {
          const postData = postSnap.data();
          setTitle(postData.title || 'Untitled Video');
          setDescription(postData.description || 'No description available.');

          const createdAt = postData.createdAt;
          setDate(createdAt?.toDate ? createdAt.toDate().toLocaleDateString() : 'Unknown Date');

          const city = postData.city || '';
          const state = postData.state || '';
          setLocation(city && state ? `${city}, ${state}` : city || state);

          const userId = postData.userId;
          if (userId) {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUserName(userData.username || 'Unknown');
              setUserImage(userData.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`);
              setUserReviews(userData.reviews || 0);
            }
          }
        } else {
          setTitle('Post Not Found');
          setDescription('Post not found or not a video.');
        }
      } catch (error) {
        console.error('Error fetching description:', error);
        setTitle('Error');
        setDescription('Error loading description.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  if (loading) {
    return <p className="video-text-area">Loading description...</p>;
  }

  return (
    <div className="video-text-area">
      {/* Title container (left-aligned) */}
      <div className="video-title-container">
        <h2 className="video-title">{title}</h2>
      </div>

      {/* Top section: user info + actions */}
      <div className="video-text-top">
        <div className="video-user-info">
          <img src={userImage} alt="User" className="user-avatar" />
          <div className="user-details">
            <div className="user-name">{userName}</div>
            <div className="user-reviews">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < userReviews ? "#f6c61d" : "#ccc"} />
              ))}
              <span className="review-count">{userReviews} Reviews</span>
            </div>
          </div>

          <div className="video-user-actions">
            <button
              className={`follow-btn ${isFollowing ? 'follow-active' : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="message-btn" onClick={handleMessage}>
              Message User
            </button>
          </div>
        </div>
      </div>

      {/* Date + Location: moved above description */}
      <div className="video-date-location">
        <div className="video-date">{date}</div>
        <div className="video-location">{location}</div>
      </div>

      {/* Description */}
      <p>{description}</p>

      {/* Bottom buttons */}
      <div className="video-text-actions">
        <button className="video-action-btn">
          <Share2 size={16} color="#00ff00" />
          SHARE
        </button>
        <button className="video-action-btn">
          <Bookmark size={16} color="#00ff00" />
          BOOKMARK
        </button>
        <button className="video-action-btn">
          <Flag size={16} color="#00ff00" />
          REPORT
        </button>
      </div>
    </div>
  );
};

export default VideoTextArea;
