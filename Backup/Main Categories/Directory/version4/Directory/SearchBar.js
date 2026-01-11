import React from 'react';
import '../../../Components/Css/SearchBar.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="sb-wrapper">
      <div className="sb-inner">
        <input
          type="text"
          placeholder="Search events..."
          className="sb-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="sb-button"
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
