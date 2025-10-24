import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import DirectoryHeader from './DirectoryHeader';
import PostSection from './PostSection';
import DirectoryCommentsSection from './DirectoryCommentsSection';
import DirectoryPostSidePanel from './DirectoryPostSidePanel';
import '../../../App.css';
import './DirectoryPost.css'; // renamed for clarity

const DirectoryPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'directory') {
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
      <DirectoryHeader />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <DirectoryCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <DirectoryPostSidePanel postId={id} />
        </div>
      </div>
    </div>
  );
};

export default DirectoryPost;
