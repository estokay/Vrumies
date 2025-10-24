import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase'; // adjust path if needed
import { doc, getDoc } from 'firebase/firestore';
import './VideoTextArea.css';

const VideoTextArea = () => {
  const { id } = useParams(); // ✅ Get postId from URL
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const postRef = doc(db, 'Posts', id); // ✅ Firestore collection
        const postSnap = await getDoc(postRef);

        if (postSnap.exists() && postSnap.data().type === 'video') {
          setDescription(postSnap.data().description || 'No description available.');
        } else {
          setDescription('Post not found or not a video.');
        }
      } catch (error) {
        console.error('Error fetching description:', error);
        setDescription('Error loading description.');
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [id]);

  if (loading) {
    return <p className="video-text-area">Loading description...</p>;
  }

  return (
    <div className="video-text-area">
      <h2>Video Description</h2>
      <p>{description}</p>
    </div>
  );
};

export default VideoTextArea;