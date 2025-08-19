import React, { useState, useEffect } from 'react';
import './CreateSellerPostOverlay.css';

import BlogPostForm from './BlogPostForm';
import RequestPostForm from './RequestPostForm';
import VehiclePostForm from './VehiclePostForm';

const POST_TYPES = {
  Blog: BlogPostForm,
  Request: RequestPostForm,
  Vehicle: VehiclePostForm,
};

function CreateSellerPostOverlay({ isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState('Blog'); // default selection

  useEffect(() => {
    if (isOpen) {
      setSelectedType('Blog');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const SelectedForm = POST_TYPES[selectedType];

  return (
    <div className="cspo-overlay">
      <div className="cspo-overlay-content">
        {/* Close Button */}
        <button className="cspo-close-btn" onClick={onClose}>✕</button>

        {/* Main Header */}
        <h2 className="cspo-main-header">
          CREATE SELLER POST
        </h2>

        {/* Type Selection */}
        <div className="cspo-post-type-buttons">
          {Object.keys(POST_TYPES).map((type) => (
            <button
              key={type}
              className={`cspo-post-type-btn ${selectedType === type ? 'cspo-selected' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Subtitle */}
        <h3 className="cspo-subtitle">
          Creating a {selectedType} Post
        </h3>

        {/* Form */}
        <div className="cspo-form-container">
          <SelectedForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CreateSellerPostOverlay;
