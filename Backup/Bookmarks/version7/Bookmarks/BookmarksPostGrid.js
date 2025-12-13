import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import './BookmarksPostGrid.css';
import BookmarksPostLayout from './BookmarksPostLayout';

function BookmarksPostGrid() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');

        // only event posts (same as before)
        const q = query(postsRef, where('type', '==', 'event'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching event posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!posts || posts.length === 0) {
    return <p>No Data Found.</p>;
  }

  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="bookmarks-post-grid">
      {displayedPosts.map((post, index) => (
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
      ))}
    </div>
  );
}

export default BookmarksPostGrid;
