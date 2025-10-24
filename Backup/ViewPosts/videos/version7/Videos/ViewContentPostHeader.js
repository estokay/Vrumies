import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';
import './ViewContentPostHeader.css';

function ViewContentPostHeader() {
  const { id } = useParams();
  const [userName, setUserName] = useState('Unknown User');
  const [userImage, setUserImage] = useState(`${process.env.PUBLIC_URL}/default-avatar.png`);
  const [userReviews, setUserReviews] = useState(0);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists() && postSnap.data().type === 'video') {
          const postData = postSnap.data();

          // Date formatting
          const createdAt = postData.createdAt;
          if (createdAt?.toDate) {
            setDate(createdAt.toDate().toLocaleDateString());
          } else {
            setDate('Unknown Date');
          }

          // Location (city/state)
          const city = postData.city || '';
          const state = postData.state || '';
          setLocation(city && state ? `${city}, ${state}` : city || state);

          // Fetch user info
          const userId = postData.userId;
          if (userId) {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUserName(userData.username || 'Unknown User');
              setUserImage(userData.profilepic || `${process.env.PUBLIC_URL}/default-avatar.png`);
              setUserReviews(userData.reviews || 0);
            }
          }
        } else {
          console.warn('Post not found or not a video');
        }
      } catch (error) {
        console.error('Error fetching post header:', error);
      }
    };

    fetchPostData();
  }, [id]);

  return (
    <div className="view-post-header">
      <div className="post-info">
        {/* Left: User Info */}
        <div className="author">
          <img src={userImage} alt="User" className="avatar" />
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <div className="user-reviews">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < userReviews ? "#f6c61d" : "#ccc"} />
              ))}
              <span className="review-count">{userReviews} Reviews</span>
            </div>
          </div>
        </div>

        {/* Right: Date & Location */}
        <div className="right-info">
          <div className="post-date">{date}</div>
          <div className="post-location">{location}</div>
        </div>
      </div>
    </div>
  );
}

export default ViewContentPostHeader;
