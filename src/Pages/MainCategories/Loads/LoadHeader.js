import React, { useState } from 'react';
import './LoadHeader.css';

const LoadHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="market-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">LOAD POSTS</span>
        </h1>
        <p className="subtitle">MAKE A LOAD POST TO FIND AVAILABLE TRUCKERS FOR TRANSPORTATION OF LOADS</p>
      </div>

      <div className="right-side">
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/market.png`}
          alt="Events Icon"
          width="70"
          height="70"
          className="events-icon"
        />
      </div>

      
    </div>
  );
};

export default LoadHeader;
