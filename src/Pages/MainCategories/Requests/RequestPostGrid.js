import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link for routing
import './RequestPostGrid.css';
import RequestPostLayout from './RequestPostLayout';

function RequestPostGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No Data Found.</p>;
  }

  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="post-grid">
      {displayedPosts.map((post, index) => (
        <div key={post.id || index}>
          <Link
            to={`/requestpost/${post.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              height: '100%',
              width: '100%',
            }}
          >
            <RequestPostLayout {...post} />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default RequestPostGrid;
