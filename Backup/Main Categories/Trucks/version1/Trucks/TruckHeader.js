import React, { useState } from 'react';
import './TruckHeader.css';
import { FaTruck } from "react-icons/fa";

const MarketHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="truck-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">TRUCK POSTS</span>
        </h1>
        <p className="subtitle">MAKE A TRUCK POST TO PROMOTE YOUR FREIGHT TRUCK TRANSPORT SERVICE</p>
      </div>

      <div className="right-side">
        <FaTruck
          size={70}
          color="#39FF14"
          className="trucks-icon"
          style={{ filter: "drop-shadow(0 0 6px #39FF14)" }}
        />
      </div>

      
    </div>
  );
};

export default MarketHeader;
