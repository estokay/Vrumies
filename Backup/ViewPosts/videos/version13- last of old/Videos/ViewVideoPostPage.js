import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import VideoPostImageBanner from './VideoPostImageBanner';
import VideoTextArea from './VideoTextArea';
import VideoCommentsSection from './VideoCommentsSection';
import RightSidePanel from './RightSidePanel';

import PageHeader from '../../../Components/PageHeader';

// ✅ INLINE STYLES REPLACING BottomSection.css
const styles = {
  bottomContainer: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    padding: '20px',
    boxSizing: 'border-box',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidePanel: {
    width: '350px',
    flexShrink: 0,
  },
};

const ViewVideoPostPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [postExists, setPostExists] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'video') {
          console.warn('Post not found or not a video');
          setPostExists(false);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setPostExists(false);
      } finally {
        setLoading(false);
      }
    };
    checkPostExists();
  }, [id]);

  if (loading)
    return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;

  if (!postExists)
    return <p style={{ color: 'white', textAlign: 'center' }}>Post not found.</p>;

  return (
    <div className="video-main-page">
      <PageHeader 
        title="Video Post" 
        backgroundUrl="https://cdn.skoda-storyboard.com/2018/08/influencer-bloger-event-skoda-classic-car.jpg" 
      />

      <VideoPostImageBanner postId={id} />

      {/* ✅ BottomSection MERGED HERE */}
      <div style={styles.bottomContainer}>
        <div style={styles.mainContent}>
          <VideoTextArea postId={id} />
          <VideoCommentsSection postId={id} />
        </div>

        <div style={styles.sidePanel}>
          <RightSidePanel />
        </div>
      </div>
    </div>
  );
};

export default ViewVideoPostPage;
