import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';


import PageHeader from '../../../Components/PageHeader';
import PostSection from './PostSection';
import BlogCommentsSection from './BlogCommentsSection';
import RightSidePanel from './RightSidePanel';
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
      <PageHeader 
        title="Blog Post" 
        backgroundUrl="https://blog.shift4shop.com/hubfs/How%20to%20Manage%20an%20eCommerce%20Blog.jpg" 
      />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <BlogCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <RightSidePanel />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
