import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RequestHeader.css';
import { FaHandsHelping } from "react-icons/fa";

const RequestHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="request-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">REQUEST POSTS</span>
        </h1>
        <p className="subtitle">
          MAKE A REQUEST POST TO ALL USERS FOR THE AUTOMOTIVE PRODUCTS OR SERVICES YOU ARE LOOKING FOR
        </p>
      </div>

      <div className="right-side">
        <FaHandsHelping
          size={70}
          color="#39FF14"
          className="directory-icon"
          style={{ filter: "drop-shadow(0 0 6px #000000ff)" }}
        />
      </div>

      
      
    </div>
  );
};

export default RequestHeader;
