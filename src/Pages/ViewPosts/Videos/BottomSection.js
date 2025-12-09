import React from 'react';
import VideoTextArea from './VideoTextArea';
import VideoCommentsSection from './VideoCommentsSection';
import RightSidePanel from './RightSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        <VideoTextArea />
        <VideoCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <RightSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
