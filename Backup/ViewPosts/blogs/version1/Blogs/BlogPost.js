import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';

import BlogHeader from './BlogHeader';
import PostSection from './PostSection';
import BlogCommentsSection from './BlogCommentsSection';
import BlogPostSidePanel from './BlogPostSidePanel';
import '../../../App.css';
import './BlogPost.css'; // renamed for clarity

const BlogPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists() || postSnap.data().type !== 'blog') {
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
      <BlogHeader />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <BlogCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <BlogPostSidePanel postId={id} />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
