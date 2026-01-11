import React, { useState, useEffect } from 'react';
import './CreateSellerPostOverlay.css';

import MarketPostForm from './MarketPostForm/MarketPostForm';

import DirectoryPostForm from './DirectoryPostForm/DirectoryPostForm';

const POST_TYPES = {
  Market: MarketPostForm,
  Directory: DirectoryPostForm,
};

function CreateSellerPostOverlay({ isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState('Market'); // default selection

  useEffect(() => {
    if (isOpen) {
      setSelectedType('Market');
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
