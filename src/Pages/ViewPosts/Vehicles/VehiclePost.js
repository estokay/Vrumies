import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import VehicleHeader from './VehicleHeader';
import PostSection from './PostSection';
import VehicleCommentsSection from './VehicleCommentsSection';
import VehiclePostSidePanel from './VehiclePostSidePanel';
import '../../../App.css';
import './VehiclePost.css'; // renamed for clarity

const VehiclePost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'vehicle') {
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
      <VehicleHeader />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <VehicleCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <VehiclePostSidePanel postId={id} />
        </div>
      </div>
    </div>
  );
};

export default VehiclePost;
