import React from 'react';
import './RequestPostLayout.css';

function RequestPostLayout({ thumbnail, title, creator, date, views, likes, comments, duration, profilePic }) {
  return (
    <a href="/request/123" className="request-post-layout">
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
        <div className="play-overlay">
          <img
            src={`${process.env.PUBLIC_URL}/play-icon.png`}
            alt="Play"
            className="play-icon"
          />
        </div>
        <span className="duration">{duration}</span>
      </div>

      <h4 className="request-post-title">{(title || 'Title of Request Post').toUpperCase()}</h4>

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

export default RequestPostLayout;
