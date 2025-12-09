// EventsRightSidePanel.js
import React from 'react';
import './EventsRightSidePanel.css';
import EventsPostLayout from './EventsPostLayout';

function EventsRightSidePanel({ posts }) {
  if (!posts || posts.length === 0) return null;

  const shownPosts = posts.slice(0, 4); // Limit to 4

  return (
    <div className="right-side-panel">
      <h3 className="panel-title">Promoted Events</h3>
      <div className="panel-posts">
        {shownPosts.map((post, index) => (
          <EventsPostLayout key={post.id || index} {...post} compact />
        ))}
      </div>
    </div>
  );
}

export default EventsRightSidePanel;
