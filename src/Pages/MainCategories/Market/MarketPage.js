import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MarketHeader from './MarketHeader';
import '../../../App.css';
import MarketRightSidePanel from './MarketRightSidePanel';
import './MarketPage.css';
import MarketPostGrid from './MarketPostGrid';

const MarketPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "event"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'market'));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching event posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="events-page">
      <MarketHeader />
      <div className="main-events">
        {posts.length === 0 ? (
          <p className="no-events">No market posts yet...</p>
        ) : (
          <>
            <MarketPostGrid posts={posts} />
            <MarketRightSidePanel posts={posts} />
          </>
        )}
      </div>
    </div>
  );
};

export default MarketPage;
