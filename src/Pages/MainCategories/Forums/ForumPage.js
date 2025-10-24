import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


import ForumHeader from './ForumHeader';
import '../../../App.css';
import ForumRightSidePanel from './ForumRightSidePanel';
import './ForumPage.css';
import ForumPostGrid from './ForumPostGrid';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "event"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'forum'));

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
      <ForumHeader />
      <div className="main-events">
        {posts.length === 0 ? (
          <p className="no-events">No forum posts yet...</p>
        ) : (
          <>
            <ForumPostGrid posts={posts} />
            <ForumRightSidePanel posts={posts} />
          </>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
