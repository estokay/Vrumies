// DirectoryPostGrid.js
import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link for routing
import '../../../Components/Css/MarketPostGrid.css'; // Using MarketPostGrid.css
import DirectoryPostLayout from './DirectoryPostLayout';

function DirectoryPostGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No Data Found.</p>;
  }

  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="events-post-grid"> {/* Updated className to match CSS */}
      {displayedPosts.map((post, index) => (
        <div key={post.id || index}>
          <Link
            to={`/directorypost/${post.id}`} // keeps directory routing
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              height: '100%',
              width: '100%',
            }}
          >
            <DirectoryPostLayout {...post} />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default DirectoryPostGrid;
