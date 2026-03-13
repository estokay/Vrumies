import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import PostSection from './PostSection';
import MainCommentsSection from '../../../Components/Comments/MainCommentsSection';
import PromotedPanel from '../../../Components/ViewPosts/PromotedPanel';
import PageHeader from '../../../Components/PageHeader';
import '../../../App.css';
import './LoadPost.css'; // renamed for clarity
import ViewOffers from '../../../Custom Offers/ViewOffers';
import GetPostRoute from "../../../Functions/GetPostRoute";

const LoadPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          console.warn('Post not found.');
          navigate("/home");
          return;
        }
        const post = postSnap.data();
        if (post.type !== 'loads') {
          console.warn('Post not a load post.');
          const postRoute = GetPostRoute(post.type);
          if (postRoute) {
            navigate(postRoute + id);
          } else {
            navigate("/home");
          }
          return;
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    checkPostExists();
  }, [id, navigate]);

  if (loading)
    return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="vpe-content-page">
     
      <PageHeader 
        title="Load Post" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1770816758/Drayage2_blog_featured-1200x675_mvno48.jpg" 
      />
    

      <PostSection postId={id} />
      <ViewOffers />
      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <MainCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <PromotedPanel category="loads" />
        </div>
      </div>
    </div>
  );
};

export default LoadPost;
