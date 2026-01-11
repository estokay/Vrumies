// src/Components/SearchBar.js
import React from 'react';
import '../../../Components/Css/SearchBar.css';
import { FaSearch } from 'react-icons/fa'; // optional, for search icon

const SearchBar = () => {
  return (
    <div className="sb-wrapper">
      <div className="sb-inner">
        <input
          type="text"
          placeholder="Search events..."
          className="sb-input"
        />
        <button className="sb-button">
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
