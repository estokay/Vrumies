//RightSidePanel.js
import React from 'react';
import DirectoryPostLayout from './DirectoryPostLayout';
import '../../../Components/Css/RightSidePanel.css';

function RightSidePanel({ posts }) {
  if (!posts || posts.length === 0) return null;

  // Filter posts that have a valid 'tokens' number
  const filteredPosts = posts
    .filter((post) => typeof post.tokens === 'number')
    .sort((a, b) => b.tokens - a.tokens); // sort descending by tokens

  return (
    <div className="events-main-right-side-panel scrollable-panel">
      <h3 className="events-main-panel-title">Promoted Directory</h3>
      <div className="events-main-panel-posts">
        {filteredPosts.map((post, index) => (
          <DirectoryPostLayout key={post.id || index} {...post} compact />
        ))}
      </div>
    </div>
  );
}

export default RightSidePanel;
