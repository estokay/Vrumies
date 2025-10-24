import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import ForumHeader from './ForumHeader';
import PostSection from './PostSection';
import ForumCommentsSection from './ForumCommentsSection';
import ForumPostSidePanel from './ForumPostSidePanel';
import '../../../App.css';
import './ForumPost.css'; // renamed for clarity

const ForumPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'forum') {
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
      <ForumHeader />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <ForumCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <ForumPostSidePanel postId={id} />
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
