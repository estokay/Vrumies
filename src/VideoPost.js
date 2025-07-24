import React from 'react';
import './VideoPost.css';

function VideoPost({ thumbnail, title, creator, date, views, likes, comments, duration, profilePic }) {
  return (
    <a href="/video/123" className="video-card">
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

      <h4 className="video-title">{(title || 'Title of Video Post').toUpperCase()}</h4>

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

export default VideoPost;
