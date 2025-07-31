import React from 'react';
import './VideoPostImageBanner.css';

function VideoPostImageBanner({ imageUrl, onPlay }) {
  return (
    <div className="video-banner-container" onClick={onPlay}>
      <img src={imageUrl} alt="Video Banner" className="video-banner-image" />
      <div className="video-banner-play">
        <svg viewBox="0 0 100 100" width="80" height="80" fill="white" stroke="black" strokeWidth="5">
          <circle cx="50" cy="50" r="45" fill="white" />
          <polygon points="40,30 70,50 40,70" fill="black" />
        </svg>
      </div>
    </div>
  );
}

export default VideoPostImageBanner;
