// src/Components/EventsHeader.js
import React from 'react';
import './EventsHeader.css';

const EventsHeader = () => {
  return (
    <div className="events-header-container">
      {/* Transparent overlay filter */}
      

      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">EVENT POSTS</span>
        </h1>
        <p className="subtitle">PROMOTE AND SHARE YOUR AUTOMOTIVE EVENTS</p>
      </div>

      <div className="right-side">
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/event.png`}
          alt="Events Icon"
          width="70"
          height="70"
          className="events-icon"
        />
      </div>
    </div>
  );
};

export default EventsHeader;
