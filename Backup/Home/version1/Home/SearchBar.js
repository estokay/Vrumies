import React from 'react';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="hsb-wrapper">
      <div className="hsb-inner">
        <input
          type="text"
          placeholder="Search events..."
          className="hsb-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="hsb-button"
          onClick={() => {
            // optional: trigger search immediately
          }}
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
