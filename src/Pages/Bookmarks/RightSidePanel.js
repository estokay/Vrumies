import React, { useEffect, useState } from 'react';
import { db } from '../../Components/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import BookmarksPostLayout from './BookmarksPostLayout';
import '../../Components/Css/RightSidePanel.css';

function RightSidePanel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setPosts([]);
          return;
        }

        // Get the current user's bookmarks
        const userRef = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userRef);

        const bookmarkedIds = (userSnap.exists() && userSnap.data().bookmarks) || [];

        if (bookmarkedIds.length === 0) {
          setPosts([]);
          return;
        }

        const postsRef = collection(db, 'Posts');
        const bookmarkedPosts = [];

        // Firestore 'in' query limit is 10
        const chunkSize = 10;
        for (let i = 0; i < bookmarkedIds.length; i += chunkSize) {
          const chunk = bookmarkedIds.slice(i, i + chunkSize);
          const q = query(postsRef, where('__name__', 'in', chunk));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Only include posts that have a valid 'tokens' field
            if (typeof data.tokens === 'number') {
              bookmarkedPosts.push({ id: doc.id, ...data });
            }
          });
        }

        // Sort descending by tokens
        bookmarkedPosts.sort((a, b) => b.tokens - a.tokens);

        setPosts(bookmarkedPosts);
      } catch (error) {
        console.error('Error fetching bookmarked posts for RightSidePanel:', error);
        setPosts([]); // ensure panel still renders
      }
    };

    fetchBookmarkedPosts();
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
