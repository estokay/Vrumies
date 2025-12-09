import React, { useState, useEffect } from 'react';
import './CreatePostOverlay.css';

import VideoPostForm from './VideoPostForm';
import BlogPostForm from './BlogPostForm';
import RequestPostForm from './RequestPostForm';
import VehiclePostForm from './VehiclePostForm';
import EventPostForm from './EventPostForm';

const POST_TYPES = {
  Video: VideoPostForm,
  Blog: BlogPostForm,
  Request: RequestPostForm,
  Vehicle: VehiclePostForm,
  Event: EventPostForm,
};

export default function CreatePostOverlay({ isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState('Video'); // default selection

  // Reset post type to default when overlay opens
  useEffect(() => {
    if (isOpen) {
      setSelectedType('Video');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const SelectedForm = POST_TYPES[selectedType];

  return (
    <div className="overlay">
      <div className="overlay-content">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Main Header */}
        <h2 style={{
          color: '#00ff00',
          fontSize: '2rem',
          fontWeight: '900',
          textAlign: 'center',
          marginBottom: '1rem',
          textShadow: '0 0 10px #00ff00'
        }}>
          CREATE POST
        </h2>

        {/* Type Selection */}
        <div className="post-type-buttons">
          {Object.keys(POST_TYPES).map((type) => (
            <button
              key={type}
              className={`post-type-btn ${selectedType === type ? 'selected' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Subtitle */}
        <h3 style={{
          textAlign: 'center',
          margin: '1rem 0 1rem',
          fontSize: '1.2rem',
          color: '#007bff'
        }}>
          Creating a {selectedType} Post
        </h3>

        {/* Form */}
        <div className="form-container">
          <SelectedForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
