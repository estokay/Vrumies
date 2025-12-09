import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VehicleHeader.css';

const VehicleHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="vehicle-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">VEHICLE POSTS</span>
        </h1>
        <p className="subtitle">POST AND SHARE THE VEHICLE YOU ARE TRYING TO SELL</p>
      </div>

      <div className="right-side">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#39FF14"
          width="70px"
          height="70px"
          style={{ filter: 'drop-shadow(0 0 3px #39FF14)' }}
        >
          <path d="M20 5h-3.586l-1.707-1.707A.996.996 0 0014 3H10c-.265 0-.52.105-.707.293L7.586 5H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2zM12 17a5 5 0 110-10 5 5 0 010 10zM12 9a3 3 0 100 6 3 3 0 000-6z"/>
        </svg>
      </div>
    </div>
  );
};

export default VehicleHeader;
