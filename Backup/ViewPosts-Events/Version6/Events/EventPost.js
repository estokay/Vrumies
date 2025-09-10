import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import NavbarWithPost from '../../../Components/NavbarWithPost';
import EventHeader from './EventHeader';
import PostSection from './PostSection';
import EventCommentsSection from './EventCommentsSection';
import EventPostSidePanel from './EventPostSidePanel';
import '../../../App.css';
import './PostSection.css';

const EventPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'event') {
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

  if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="content-page">
      <EventHeader />
      <PostSection postId={id} />  {/* Pass only the post ID */}
      <div className="bottom-section-container">
        <div className="bottom-section-main-content">
          <EventCommentsSection postId={id} />
        </div>
        <div className="bottom-section-side-panel">
          <EventPostSidePanel postId={id} />
        </div>
      </div>
    </div>
  );
};

export default EventPost;
