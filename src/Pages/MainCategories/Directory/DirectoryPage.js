import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


import DirectoryHeader from './DirectoryHeader';
import '../../../App.css';
import DirectoryRightSidePanel from './DirectoryRightSidePanel';
import './DirectoryPage.css';
import DirectoryPostGrid from './DirectoryPostGrid';

const DirectoryPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "event"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'directory'));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching directory posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="events-page">
      <DirectoryHeader />
      <div className="main-events">
        {posts.length === 0 ? (
          <p className="no-events">No directory posts yet...</p>
        ) : (
          <>
            <DirectoryPostGrid posts={posts} />
            <DirectoryRightSidePanel posts={posts} />
          </>
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;
