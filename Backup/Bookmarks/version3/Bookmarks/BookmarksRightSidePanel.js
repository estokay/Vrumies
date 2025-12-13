// EventsRightSidePanel.js
import React from 'react';
import './BookmarksRightSidePanel.css';
import BookmarksPostLayout from './BookmarksPostLayout';

function BookmarksRightSidePanel({ posts }) {
  if (!posts || posts.length === 0) return null;

  const shownPosts = posts.slice(0, 4); // Limit to 4

  return (
    <div className="right-side-panel">
      <h3 className="panel-title">Following</h3>
      <div className="panel-posts">
        {shownPosts.map((post, index) => (
          <BookmarksPostLayout key={post.id || index} {...post} compact />
        ))}
      </div>
    </div>
  );
}

export default BookmarksRightSidePanel;
