import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import PostSection from './PostSection';
import TruckCommentsSection from './TruckCommentsSection';
import RightSidePanel from './RightSidePanel';
import PageHeader from '../../../Components/PageHeader';
import '../../../App.css';
import './TruckPost.css'; // renamed for clarity

const TruckPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'trucks') {
          console.warn('Post not found or not an event');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    checkPostExists();
  }, [id]);

  if (loading)
    return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="vpe-content-page">
     
      <PageHeader 
        title="Truck Post" 
        backgroundUrl="https://images.squarespace-cdn.com/content/v1/6598c8e83ff0af0197ff19f9/a05c7d5e-3711-48bb-a4c8-f3ce0f076355/JCCI-2024-Banner.jpg" 
      />
    

      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <TruckCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <RightSidePanel />
        </div>
      </div>
    </div>
  );
};

export default TruckPost;
