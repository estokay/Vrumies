import React from 'react';
import './VideoSubHeader.css';
import { Share2, Bookmark, Flag } from 'lucide-react';

function VideoSubHeader() {
  return (
    <div className="video-sub-header">
      <div className="video-category">
        <span className="video-label">Category:</span>
        <span className="video-value">Video</span>
      </div>

      <div className="video-actions">
        <button className="video-action-btn">
          <Share2 size={16} color="#00ff00" />
          SHARE
        </button>
        <button className="video-action-btn">
          <Bookmark size={16} color="#00ff00" />
          BOOKMARK
        </button>
        <button className="video-action-btn">
          <Flag size={16} color="#00ff00" />
          REPORT
        </button>
      </div>
    </div>
  );
}

export default VideoSubHeader;
