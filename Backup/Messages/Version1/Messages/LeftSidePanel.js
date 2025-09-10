import React from 'react';
import './LeftSidePanel.css';

const users = [
  "Rayna Culhane",
  "Michelle Mathews",
  "Alexa Volskawski",
  "Adna Muhammad",
  "Henry Stephens",
  "Michael Cutler"
];

const profileImages = [
  "https://xsgames.co/randomusers/assets/avatars/female/1.jpg",
  "https://xsgames.co/randomusers/assets/avatars/female/2.jpg",
  "https://xsgames.co/randomusers/assets/avatars/female/3.jpg",
  "https://xsgames.co/randomusers/assets/avatars/male/4.jpg",
  "https://xsgames.co/randomusers/assets/avatars/male/5.jpg",
  "https://xsgames.co/randomusers/assets/avatars/male/6.jpg"
];

const LeftSidePanel = () => {
  return (
    <div className="lsp-panel">
      <input type="text" placeholder="Search username..." className="lsp-search" />
      <ul className="lsp-user-list">
        {users.map((user, index) => (
          <li key={index} className="lsp-user-item">
            <div className="lsp-user-left">
              <div className="lsp-pic-wrapper">
                <img src={profileImages[index]} alt={user} className="lsp-user-pic" />
                <span className="lsp-online-dot"></span>
              </div>
              <div className="lsp-user-info">
                <h4>{user}</h4>
                <p>Lorem ipsum dolor sit amet...</p>
              </div>
            </div>
            <span className="lsp-timestamp">5:30 AM</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidePanel;
