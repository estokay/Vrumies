import React from 'react';
import { Link } from 'react-router-dom';
import './EventsPostLayout.css';

function EventsPostLayout({ id, images, title, createdAt }) {
  // Convert Firestore timestamp to a readable date
  const formattedDate = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleDateString()
    : 'Date not available';

  return (
    <Link to={`/eventpost/${id}`} className="events-post-layout">
      <div className="card-header">
        <div className="header-left">
          <img
            src={`${process.env.PUBLIC_URL}/default-profile.png`}
            alt="Creator"
            className="profile-pic"
          />
          <div className="creator-info">
            <p className="creator-name">Unknown</p>
            <p className="date">{formattedDate}</p>
          </div>
        </div>
        <span className="points">0 <span className="star">⭐</span></span>
      </div>

      <div className="thumbnail-container">
        <img
          src={images && images.length > 0 ? images[0] : `${process.env.PUBLIC_URL}/default-thumbnail.png`}
          alt={title || 'Event Thumbnail'}
          className="thumbnail"
        />
      </div>

      <h4 className="events-post-title">
        {(title || 'Untitled Event').toUpperCase()}
      </h4>

      <div className="card-footer">
        <span className="likes">
          <img src={`${process.env.PUBLIC_URL}/like.png`} alt="Likes" />
          0
        </span>
        <span className="comments">
          <img src={`${process.env.PUBLIC_URL}/comment.jpg`} alt="Comments" />
          0
        </span>
      </div>
    </Link>
  );
}

export default EventsPostLayout;
