import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import MarketHeader from './MarketHeader';
import PostSection from './PostSection';
import MarketCommentsSection from './MarketCommentsSection';
import MarketPostSidePanel from './MarketPostSidePanel';
import '../../../App.css';
import './MarketPost.css'; // renamed for clarity

const MarketPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'market') {
          console.warn('Post not found or not an market post');
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
      <MarketHeader />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <MarketCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <MarketPostSidePanel postId={id} />
        </div>
      </div>
    </div>
  );
};

export default MarketPost;
