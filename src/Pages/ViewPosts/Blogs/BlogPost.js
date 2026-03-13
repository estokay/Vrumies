import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';


import PageHeader from '../../../Components/PageHeader';
import PostSection from './PostSection';
import MainCommentsSection from '../../../Components/Comments/MainCommentsSection';
import '../../../App.css';
import './BlogPost.css'; // renamed for clarity
import PromotedPanel from '../../../Components/ViewPosts/PromotedPanel';
import GetPostRoute from "../../../Functions/GetPostRoute";

const BlogPost = () => {
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
        if (post.type !== 'blog') {
          console.warn('Post not a blog');
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
        title="Blog Post" 
        backgroundUrl="https://blog.shift4shop.com/hubfs/How%20to%20Manage%20an%20eCommerce%20Blog.jpg" 
      />
      <PostSection postId={id} />

      <div className="vpe-bottom-section-container">
        <div className="vpe-bottom-section-main-content">
          <MainCommentsSection postId={id} />
        </div>

        <div className="vpe-bottom-section-side-panel">
          <PromotedPanel category="blog" />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
