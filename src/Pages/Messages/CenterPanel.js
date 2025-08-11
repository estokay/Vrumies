import React from 'react';
import './CenterPanel.css';

const CenterPanel = () => {
  return (
    <div className="inbox-center-panel">
      <div className="inbox-chat-header">
        <img
          src="https://xsgames.co/randomusers/assets/avatars/female/1.jpg"
          alt="Rayna Culhane"
          className="inbox-profile-pic"
        />
        <span className="inbox-online-dot"></span>
        <h3>Rayna Culhane</h3>
      </div>

      <div className="inbox-chat-messages">
        <div className="inbox-message inbox-sent">
          <p>Hello, Rayna!</p>
          <span>08:00 PM</span>
        </div>
        <div className="inbox-message inbox-sent">
          <p>What are you doing?</p>
          <span>08:00 PM</span>
        </div>
        <div className="inbox-message inbox-received">
          <p>I'm lying down</p>
          <span>09:00 PM</span>
        </div>
        <div className="inbox-message inbox-sent">
          <p>Let's hang out!</p>
          <span>09:30 PM</span>
        </div>
        <div className="inbox-message inbox-received">
          <p>Let's go!</p>
          <span>09:30 PM</span>
        </div>
        <div className="inbox-typing-indicator">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>

      <div className="inbox-chat-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default CenterPanel;
