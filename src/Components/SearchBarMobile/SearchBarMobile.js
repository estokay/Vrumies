import React from "react";
import { FaFilter } from "react-icons/fa";
import "./SearchBarMobile.css";

const SearchBarMobile = ({
  searchQuery,
  setSearchQuery,
  onOpenFilters
}) => {
  return (
    <div className="m-search-bar-row">
      <input
        className="m-search-input-field"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button
        className="m-filter-toggle-btn"
        onClick={onOpenFilters}
      >
        <FaFilter />
      </button>
    </div>
  );
};

export default SearchBarMobile;