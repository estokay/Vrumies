import React, { useState, useEffect } from 'react';
import './CreatePostOverlayMobile.css';

// Importing existing form components
import VideoPostForm from '../CreatePost/VideoPostForm/VideoPostForm';
import BlogPostForm from '../CreatePost/BlogPostForm/BlogPostForm';
import RequestPostForm from '../CreatePost/RequestPostForm/RequestPostForm';
import VehiclePostForm from '../CreatePost/VehiclePostForm/VehiclePostForm';
import EventPostForm from '../CreatePost/EventPostForm/EventPostForm';
import LoadPostForm from '../CreatePost/LoadPostForm/LoadPostForm';

const MOBILE_POST_TYPES = {
  Video: VideoPostForm,
  Blog: BlogPostForm,
  Request: RequestPostForm,
  Vehicle: VehiclePostForm,
  Event: EventPostForm,
  Load: LoadPostForm,
};

export default function CreatePostOverlayMobile({ isOpen, onClose }) {
  const [activeType, setActiveType] = useState('Video');

  // Reset to default on open
  useEffect(() => {
    if (isOpen) {
      setActiveType('Video');
      // Prevent background scrolling when mobile overlay is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const ActiveForm = MOBILE_POST_TYPES[activeType];

  return (
    <div className="m-overlay-root">
      <div className="m-overlay-backdrop" onClick={onClose} />
      
      <div className="m-panel-container">

        <button className="m-exit-trigger" onClick={onClose}>✕</button>

        <header className="m-header-section">
          <h2 className="m-brand-title">CREATE POST</h2>
          <div className="m-type-scroller">
            {Object.keys(MOBILE_POST_TYPES).map((type) => (
              <button
                key={type}
                className={`m-category-tab ${activeType === type ? 'm-tab-active' : ''}`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </header>

        

        <div className="m-content-viewport">
          <div className="m-form-wrapper">
            <ActiveForm onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}