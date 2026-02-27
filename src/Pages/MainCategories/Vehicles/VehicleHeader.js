import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VehicleHeader.css';
import { FaCar } from "react-icons/fa";

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
        <FaCar
          size={70}
          color="#39FF14"
          style={{ filter: "drop-shadow(0 0 6px #000000ff)" }}
        />
      </div>
    </div>
  );
};

export default VehicleHeader;
