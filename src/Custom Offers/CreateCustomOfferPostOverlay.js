import React, { useState, useEffect } from 'react';
import './CreateCustomOfferPostOverlay.css';

import OfferPostForm from './OfferPostForm/OfferPostForm';

const POST_TYPES = {
  Offer: OfferPostForm,
};

function CreateCustomOfferPostOverlay({ isOpen, onClose, originalPost }) {
  const [selectedType, setSelectedType] = useState('Offer'); // default selection

  useEffect(() => {
    if (isOpen) {
      setSelectedType('Offer');
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
          CREATE CUSTOM OFFER
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
          <SelectedForm onClose={onClose} originalPost={originalPost} />
        </div>
      </div>
    </div>
  );
};

export default CreateCustomOfferPostOverlay;
