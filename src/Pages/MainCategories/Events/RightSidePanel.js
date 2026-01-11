//RightSidePanel.js
import React from 'react';
import EventsPostLayout from './EventsPostLayout';
import '../../../Components/Css/RightSidePanel.css';

function RightSidePanel({ posts }) {
  // Filter posts that have a valid 'tokens' number
  const filteredPosts = posts
    .filter((post) => typeof post.tokens === 'number')
    .sort((a, b) => b.tokens - a.tokens); // sort descending by tokens

  return (
    <div className="events-main-right-side-panel scrollable-panel">
      <h3 className="events-main-panel-title">Promoted Events</h3>
      <div className="events-main-panel-posts">
        {filteredPosts.length === 0 ? (
          <p className="no-promoted">No promoted posts found.</p>
        ) : (
          filteredPosts.map((post, index) => (
            <EventsPostLayout key={post.id || index} {...post} compact />
          ))
        )}
      </div>
    </div>
  );
}

export default RightSidePanel;
