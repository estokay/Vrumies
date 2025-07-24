import React from 'react';
import './VideoPost.css';

function VideoPost({ thumbnail, title, creator, date, views, likes, comments, duration, profilePic }) {
  return (
    <a href="/video/123" className="video-card">
      <div className="card-header">
        <img src={profilePic} alt={creator} className="profile-pic" />
        <div>
          <p className="creator-name">{creator}</p>
          <p className="date">{date}</p>
        </div>
        <span className="points">13⭐</span>
      </div>

      <div className="thumbnail-container">
        <img src={thumbnail} alt={title} className="thumbnail" />
        <div className="play-overlay">▶</div>
        <span className="duration">{duration}</span>
      </div>

      <h4 className="video-title">{title}</h4>

      <div className="card-footer">
        <span className="likes">👍 {likes}</span>
        <span className="comments">💬 {comments}</span>
      </div>
    </a>
  );
}

export default VideoPost;
