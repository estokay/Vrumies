import React, { useState, useEffect } from 'react';
import './CreateSellerPostOverlayMobile.css';

// Importing existing Seller form components
import MarketPostForm from '../CreateSellerPost/MarketPostForm/MarketPostForm';
import TruckPostForm from '../CreateSellerPost/TruckPostForm/TruckPostForm';
import DirectoryPostForm from '../CreateSellerPost/DirectoryPostForm/DirectoryPostForm';

const SELLER_POST_TYPES = {
  Market: MarketPostForm,
  Directory: DirectoryPostForm,
  Truck: TruckPostForm,
};

export default function CreateSellerPostOverlayMobile({ isOpen, onClose }) {
  const [activeType, setActiveType] = useState('Market');

  // Reset to default on open and lock body scroll
  useEffect(() => {
    if (isOpen) {
      setActiveType('Market');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const ActiveForm = SELLER_POST_TYPES[activeType];

  return (
    <div className="m-seller-overlay-root">
      <div className="m-seller-overlay-backdrop" onClick={onClose} />
      
      <div className="m-seller-panel-container">
        {/* Close Button */}
        <button className="m-seller-exit-trigger" onClick={onClose}>✕</button>

        <header className="m-seller-header-section">
          <h2 className="m-seller-brand-title">CREATE SELLER POST</h2>
          
          {/* Horizontal Scroll for Seller Types */}
          <div className="m-seller-type-scroller">
            {Object.keys(SELLER_POST_TYPES).map((type) => (
              <button
                key={type}
                className={`m-seller-category-tab ${activeType === type ? 'm-seller-tab-active' : ''}`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </header>

        

        {/* Form Area */}
        <div className="m-seller-content-viewport">
          <div className="m-seller-form-wrapper">
            <ActiveForm onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}