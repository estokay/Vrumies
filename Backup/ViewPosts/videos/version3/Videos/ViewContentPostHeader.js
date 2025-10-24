import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase'; // adjust path as needed
import { doc, getDoc } from 'firebase/firestore';
import './ViewContentPostHeader.css';

function ViewContentPostHeader() {
  const { id } = useParams(); // ✅ Grab post ID from URL
  const [postTitle, setPostTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // 🔹 Fetch the post document
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists() && postSnap.data().type === 'video') {
          const postData = postSnap.data();

          // ✅ Post title
          setPostTitle(postData.title || 'Untitled Post');

          // ✅ Location (city, state)
          const city = postData.city || '';
          const state = postData.state || '';
          setLocation(city && state ? `${city}, ${state}` : city || state);

          // ✅ Date formatting
          const createdAt = postData.createdAt;
          if (createdAt?.toDate) {
            setDate(createdAt.toDate().toLocaleDateString());
          } else {
            setDate('Unknown Date');
          }

          // ✅ Fetch user info using userId
          const userId = postData.userId;
          if (userId) {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUserName(userData.username || 'Unknown User');
              setUserImage(userData.profilepic || '/default-avatar.png');
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
        <div className="author">
          <img src={userImage} alt="User" className="avatar" />
          <span className="user-name">{userName}</span>
        </div>

        <div className="post-title">
          <h2>{postTitle}</h2>
          <p className="location">{location}</p>
        </div>

        <div className="post-date">
          {date}
        </div>
      </div>
    </div>
  );
}

export default ViewContentPostHeader;
