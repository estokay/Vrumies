import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import './BookmarksPostGrid.css';
import BookmarksPostLayout from './BookmarksPostLayout';

function BookmarksPostGrid() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');

        // Only event posts
        const q = query(postsRef, where('type', '==', 'event'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
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
          No Data Found.
        </p>
      )}
    </div>
  );
}

export default BookmarksPostGrid;
