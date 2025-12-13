import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link for routing
import './BookmarksPostGrid.css'; // Renamed CSS file for consistency
import BookmarksPostLayout from './BookmarksPostLayout';

function BookmarksPostGrid({ posts }) {
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