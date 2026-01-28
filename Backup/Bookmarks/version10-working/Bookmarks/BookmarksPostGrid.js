import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Components/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import './BookmarksPostGrid.css';
import BookmarksPostLayout from './BookmarksPostLayout';

function BookmarksPostGrid() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setPosts([]); // no user signed in
          return;
        }

        const userRef = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userRef);

        const bookmarkedIds = (userSnap.exists() && userSnap.data().bookmarks) || [];

        if (bookmarkedIds.length === 0) {
          setPosts([]); // no bookmarks
          return;
        }

        const postsRef = collection(db, 'Posts');
        const bookmarkedPosts = [];

        const chunkSize = 10; // Firestore 'in' query limit
        for (let i = 0; i < bookmarkedIds.length; i += chunkSize) {
          const chunk = bookmarkedIds.slice(i, i + chunkSize);
          const q = query(postsRef, where('__name__', 'in', chunk));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            bookmarkedPosts.push({ id: doc.id, ...doc.data() });
          });
        }

        setPosts(bookmarkedPosts);
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
        setPosts([]); // ensure grid still renders
      }
    };

    fetchBookmarkedPosts();
  }, []);

  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="bookmarks-post-grid">
      {displayedPosts.length > 0 ? (
        displayedPosts.map((post, index) => (
          <div key={post.id || index}>
            <Link
              to={`/bookmarkpost/${post.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                height: '100%',
                width: '100%',
              }}
            >
              <BookmarksPostLayout {...post} />
            </Link>
          </div>
        ))
      ) : (
        <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>
          No Bookmarked Posts Found.
        </p>
      )}
    </div>
  );
}

export default BookmarksPostGrid;
