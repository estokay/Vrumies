import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase'; // adjust path if needed
import { doc, getDoc } from 'firebase/firestore';
import './VideoPostImageBanner.css';

function VideoPostImageBanner({ onPlay }) {
  const { id } = useParams(); // ✅ Grab postId from the URL
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const postRef = doc(db, 'Posts', id); // ✅ Collection: Posts
        const postSnap = await getDoc(postRef);

        if (postSnap.exists() && postSnap.data().type === 'video') {
          setImageUrl(postSnap.data().image || null); // ✅ Use "image" field
        } else {
          setImageUrl(null);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  if (loading) {
    return <div className="video-banner-container">Loading image...</div>;
  }

  if (!imageUrl) {
    return <div className="video-banner-container">Image not found.</div>;
  }

  return (
    <div className="video-banner-container" onClick={onPlay}>
      <img src={imageUrl} alt="Video Banner" className="video-banner-image" />
      <div className="video-banner-play">
        <svg viewBox="0 0 100 100" width="80" height="80" fill="white" stroke="black" strokeWidth="5">
          <circle cx="50" cy="50" r="45" fill="white" />
          <polygon points="40,30 70,50 40,70" fill="black" />
        </svg>
      </div>
    </div>
  );
}

export default VideoPostImageBanner;
