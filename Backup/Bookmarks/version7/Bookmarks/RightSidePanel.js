import React, { useEffect, useState } from 'react';
import { db } from '../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BookmarksPostLayout from './BookmarksPostLayout';
import '../../Components/Css/RightSidePanel.css';

function RightSidePanel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');

        // Fetch only "event" posts
        const q = query(postsRef, where('type', '==', 'event'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((post) => typeof post.tokens === 'number'); // only posts with tokens

        // Sort descending by tokens
        data.sort((a, b) => b.tokens - a.tokens);

        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts for RightSidePanel:', err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="events-main-right-side-panel scrollable-panel">
      <h3 className="events-main-panel-title">Promoted Bookmarks</h3>
      <div className="events-main-panel-posts">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <BookmarksPostLayout key={post.id || index} {...post} compact />
          ))
        ) : (
          <p style={{ color: '#ffffff', textAlign: 'center' }}>
            No promoted bookmarks yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RightSidePanel;
