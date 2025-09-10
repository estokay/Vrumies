import React from 'react';
import './RightSidePanel.css';

const automotiveImages = [
  "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
  "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg",
  "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg",
  "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  "https://images.pexels.com/photos/305070/pexels-photo-305070.jpeg",
  "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  "https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg",
  "https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg"
];

const RightSidePanel = () => {
  return (
    <div className="rsp-panel">
      <div className="rsp-profile-header">
        <div className="rsp-profile-pic-wrapper">
          <img
            src="https://xsgames.co/randomusers/assets/avatars/female/1.jpg"
            alt="Rayna Culhane"
            className="rsp-profile-pic"
          />
          <span className="rsp-online-dot"></span>
        </div>
        <h3 className="rsp-profile-name">Rayna Culhane</h3>
      </div>

      <h4 className="rsp-media-title">Chat Media</h4>
      <div className="rsp-media-grid">
        {automotiveImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Media ${index + 1}`}
            className="rsp-media-item"
          />
        ))}
      </div>

      <button className="rsp-block-button">Block</button>
    </div>
  );
};

export default RightSidePanel;
