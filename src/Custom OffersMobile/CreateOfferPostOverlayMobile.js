import React, { useState, useEffect } from 'react';
import './CreateOfferPostOverlayMobile.css';

// Importing the Offer form component
import OfferPostForm from '../Custom Offers/OfferPostForm/OfferPostForm';

const OFFER_POST_TYPES = {
  Offer: OfferPostForm,
};

export default function CreateOfferPostOverlayMobile({ isOpen, onClose, originalPost }) {
  const [activeType, setActiveType] = useState('Offer');

  // Handle body scroll locking and reset state on open
  useEffect(() => {
    if (isOpen) {
      setActiveType('Offer');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const ActiveForm = OFFER_POST_TYPES[activeType];

  return (
    <div className="m-offer-overlay-root">
      <div className="m-offer-overlay-backdrop" onClick={onClose} />
      
      <div className="m-offer-panel-container">
        {/* Close Button */}
        <button className="m-offer-exit-trigger" onClick={onClose}>✕</button>

        <header className="m-offer-header-section">
          <h2 className="m-offer-brand-title">CREATE CUSTOM OFFER</h2>
          
          {/* Tabs for Offer Types */}
          <div className="m-offer-type-scroller">
            {Object.keys(OFFER_POST_TYPES).map((type) => (
              <button
                key={type}
                className={`m-offer-category-tab ${activeType === type ? 'm-offer-tab-active' : ''}`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </header>

        {/* Subtitle Indicator */}
        <div className="m-offer-status-indicator">
          Creating a <span className="m-offer-highlight-text">{activeType}</span> for this post
        </div>

        {/* Form Viewport */}
        <div className="m-offer-content-viewport">
          <div className="m-offer-form-wrapper">
            <ActiveForm onClose={onClose} originalPost={originalPost} />
          </div>
        </div>
      </div>
    </div>
  );
}