import React from 'react';
import './PostGrid.css';
import VideoPostLayout from './VideoPostLayout';

function PostGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No Data Found.</p>;
  }

  // Limit posts to max 16
  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="post-grid">
      {displayedPosts.map((post, index) => (
        <VideoPostLayout
          key={post.id || index}
          {...post}
        />
      ))}
    </div>
  );
}

export default PostGrid;
