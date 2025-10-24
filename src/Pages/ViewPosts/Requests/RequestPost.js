import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import RequestHeader from './RequestHeader';
import PostSection from './PostSection';
import RequestCommentsSection from './RequestCommentsSection';
import RequestPostSidePanel from './RequestPostSidePanel';
import '../../../App.css';
import './RequestPost.css'; // renamed for clarity

const RequestPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'request') {
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
      <RequestHeader />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <RequestCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <RequestPostSidePanel postId={id} />
        </div>
      </div>
    </div>
  );
};

export default RequestPost;
