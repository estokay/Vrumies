import React, { useState } from 'react';
import './LoadHeader.css';
import { FaClipboardList } from "react-icons/fa";

const LoadHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="load-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">LOAD POSTS</span>
        </h1>
        <p className="subtitle">MAKE A LOAD POST TO FIND AVAILABLE TRUCKERS FOR TRANSPORTATION OF LOADS</p>
      </div>

      <div className="right-side">
        <FaClipboardList
          size={70}
          color="#39FF14"
          className="loads-icon"
          style={{ filter: "drop-shadow(0 0 6px #39FF14)" }}
        />
      </div>

      
    </div>
  );
};

export default LoadHeader;
