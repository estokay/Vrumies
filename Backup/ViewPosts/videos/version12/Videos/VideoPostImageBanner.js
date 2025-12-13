import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './VideoPostImageBanner.css';

function VideoPostImageBanner() {
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists() && postSnap.data().type === 'video') {
          const postData = postSnap.data();
          setImageUrl(postData.image || null);
          setVideoUrl(postData.video || null);
        } else {
          setImageUrl(null);
          setVideoUrl(null);
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
        setImageUrl(null);
        setVideoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handlePlay = () => {
    if (videoUrl) {
      setIsPlaying(true);
    }
  };

  if (loading) {
    return <div className="video-banner-container">Loading...</div>;
  }

  if (!imageUrl && !videoUrl) {
    return <div className="video-banner-container">Post not found.</div>;
  }

  return (
    <div className="video-banner-container" onClick={!isPlaying ? handlePlay : undefined}>
      <div className="video-banner-inner">
        {!isPlaying ? (
          <>
            <img src={imageUrl} alt="Video Banner" className="video-banner-image" />
            <div className="video-banner-play">
              <svg viewBox="0 0 100 100" width="80" height="80" fill="white" stroke="black" strokeWidth="5">
                <circle cx="50" cy="50" r="45" fill="white" />
                <polygon points="40,30 70,50 40,70" fill="black" />
              </svg>
            </div>
          </>
        ) : (
          <video className="video-banner-image" controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}

export default VideoPostImageBanner;
