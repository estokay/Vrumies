import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import PageHeader from '../../../Components/PageHeader';
import PostSection from './PostSection';
import MarketCommentsSection from './MarketCommentsSection';
import RightSidePanel from './RightSidePanel';
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
      <PageHeader 
        title="Market Post" 
        backgroundUrl="https://www.roadangelgroup.com/cdn/shop/articles/Driving_Into_The_Future_Featured.png?v=1687957466&width=1500" 
      />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <MarketCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <RightSidePanel />
        </div>
      </div>
    </div>
  );
};

export default MarketPost;
