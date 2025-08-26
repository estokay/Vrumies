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
import './EventPost.css';

const EventPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists() && postSnap.data().type === 'event') {
          setPost(postSnap.data());
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;
  if (!post) return <p style={{ color: 'white', textAlign: 'center' }}>Post not found.</p>;

  return (
    <div className="content-page">
      
      <EventHeader />
      <PostSection post={post} />
      <div className="bottom-section-container">
        <div className="bottom-section-main-content">
          <EventCommentsSection postId={id} />
        </div>
        <div className="bottom-section-side-panel">
          <EventPostSidePanel post={post} />
        </div>
      </div>
    </div>
  );
};

export default EventPost;
