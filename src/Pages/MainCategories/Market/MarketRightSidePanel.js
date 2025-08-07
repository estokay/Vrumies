// MarketRightSidePanel.js
import React from 'react';
import './MarketRightSidePanel.css';
import MarketPostLayout from './MarketPostLayout';

function MarketRightSidePanel({ posts }) {
  if (!posts || posts.length === 0) return null;

  const shownPosts = posts.slice(0, 4); // Limit to 4

  return (
    <div className="right-side-panel">
      <h3 className="panel-title">Following</h3>
      <div className="panel-posts">
        {shownPosts.map((post, index) => (
          <MarketPostLayout key={post.id || index} {...post} compact />
        ))}
      </div>
    </div>
  );
}

export default MarketRightSidePanel;
