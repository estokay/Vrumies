import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';


import PageHeader from '../../../Components/PageHeader';
import PostSection from './PostSection';
import VideoCommentsSection from './VideoCommentsSection';
import RightSidePanel from './RightSidePanel';
import '../../../App.css';
import './VideoPost.css'; // renamed for clarity

const VideoPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'video') {
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
        title="Video Post" 
        backgroundUrl="https://cdn.skoda-storyboard.com/2018/08/influencer-bloger-event-skoda-classic-car.jpg" 
      />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <VideoCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <RightSidePanel />
        </div>
      </div>
    </div>
  );
};

export default VideoPost;
