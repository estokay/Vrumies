import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../Components/firebase';
import { doc, getDoc } from 'firebase/firestore';


import VideoPostImageBanner from './VideoPostImageBanner';

import BottomSection from './BottomSection';

import PageHeader from '../../../Components/PageHeader';


const ViewVideoPostPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [postExists, setPostExists] = useState(true);

  useEffect(() => {
    const checkPostExists = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'Posts', id); // ✅ Correct collection name
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
      
      <BottomSection postId={id} />
    </div>
  );
};

export default ViewVideoPostPage;