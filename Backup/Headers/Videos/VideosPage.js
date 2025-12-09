import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


import VideosHeader from './VideosHeader';
import '../../../App.css';
import VideosRightSidePanel from './VideosRightSidePanel';
import './VideosPage.css';
import VideosPostGrid from './VideosPostGrid';

const VideosPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "event"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'video'));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching video posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="events-page">
      <VideosHeader />
      <div className="main-events">
        {posts.length === 0 ? (
          <p className="no-events">No videos yet...</p>
        ) : (
          <>
            <VideosPostGrid posts={posts} />
            <VideosRightSidePanel posts={posts} />
          </>
        )}
      </div>
    </div>
  );
};

export default VideosPage;
