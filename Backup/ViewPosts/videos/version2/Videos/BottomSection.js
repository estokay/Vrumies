import React from 'react';
import VideoTextArea from './VideoTextArea';
import VideoCommentsSection from './VideoCommentsSection';
import VideoPostSidePanel from './VideoPostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        <VideoTextArea />
        <VideoCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <VideoPostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
