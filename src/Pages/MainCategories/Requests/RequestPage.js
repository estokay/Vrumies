import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RequestHeader from './RequestHeader';
import '../../../App.css';
import RequestRightSidePanel from './RequestRightSidePanel';
import './RequestPage.css';
import RequestPostGrid from './RequestPostGrid';

const RequestPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "request"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'request'));

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
      <RequestHeader />
      <div className="main-events">
        {posts.length === 0 ? (
          <p className="no-events">No request posts yet...</p>
        ) : (
          <>
            <RequestPostGrid posts={posts} />
            <RequestRightSidePanel posts={posts} />
          </>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
