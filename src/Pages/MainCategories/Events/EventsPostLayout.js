import React from 'react';
import './EventsPostLayout.css';

function EventsPostLayout({ thumbnail, title, creator, date, views, likes, comments, profilePic }) {
  return (
    <a href="/events/123" className="events-post-layout">
      <div className="card-header">
        <div className="header-left">
          <img src={profilePic} alt={creator} className="profile-pic" />
          <div className="creator-info">
            <p className="creator-name">{creator}</p>
            <p className="date">{date}</p>
          </div>
        </div>
        <span className="points">13 <span className="star">⭐</span></span>
      </div>

      <div className="thumbnail-container">
        <img src={thumbnail} alt={title} className="thumbnail" />
      </div>

      <h4 className="events-post-title">{(title || 'Title of Event Post').toUpperCase()}</h4>

      <div className="card-footer">
        <span className="likes">
          <img src={`${process.env.PUBLIC_URL}/like.png`} alt="Likes" />
          {likes}
        </span>
        <span className="comments">
          <img src={`${process.env.PUBLIC_URL}/comment.jpg`} alt="Comments" />
          {comments}
        </span>
      </div>
    </a>
  );
}

export default EventsPostLayout;
