import React, { useState } from 'react';
import './DirectoryHeader.css';

const DirectoryHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="directory-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">DIRECTORY POSTS</span>
        </h1>
        <p className="subtitle">MAKE A DIRECTORY POST TO PROMOTE YOUR AUTOMOTIVE SERVICES</p>
      </div>

      <div className="right-side">
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/directory.png`}
          alt="Events Icon"
          width="70"
          height="70"
          className="events-icon"
        />
      </div>

      
    </div>
  );
};

export default DirectoryHeader;
