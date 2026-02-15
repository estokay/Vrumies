import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import PostSection from './PostSection';
import MainCommentsSection from '../../../Components/Comments/MainCommentsSection';
import PromotedPanel from '../../../Components/ViewPosts/PromotedPanel';
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
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1770816086/67fdf9af062252f0b85b1813_6377b53b0b2bd628e3eeb4b5_8_ucpg9a.jpg" 
      />
    

      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <MainCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <PromotedPanel category="trucks" />
        </div>
      </div>
    </div>
  );
};

export default TruckPost;
