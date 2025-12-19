import React, { useState } from 'react';
import '../../../Components/Css/FilterPanel.css';

const locationsList = ['Houston, TX', 'Dallas, TX', 'San Antonio, TX'];
const filterOptionsList = ['Today', 'This Week', 'This Month'];
const sortByList = ['Newest', 'Likes', 'Highest Rating'];

const FilterPanel = () => {
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [expanded, setExpanded] = useState({
    location: true,
    filterOptions: true,
    sortBy: true,
  });
  const [selectedLocations, setSelectedLocations] = useState(['Show All']);
  const [selectedFilters, setSelectedFilters] = useState(['Show All']);
  const [selectedSortBy, setSelectedSortBy] = useState('Show All');

  const toggleExpand = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMultiSelect = (value, setSelected, selected) => {
    if (value === 'Show All') {
      setSelected(['Show All']);
    } else {
      let updated = selected.includes('Show All')
        ? [value]
        : selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      if (updated.length === 0) updated = ['Show All'];
      setSelected(updated);
    }
  };

  // Add keyword if valid
  const handleAddKeyword = () => {
    const trimmed = keyword.trim();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 20) {
      setKeywords([...keywords, trimmed]);
      setKeyword('');
    }
  };

  // Handle pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  // Remove keyword
  const handleRemoveKeyword = (word) => {
    setKeywords(keywords.filter((k) => k !== word));
  };

  return (
    <div className="filterpanel">
      <div className="filterpanel-scroll">
        {/* Keyword Filter Section */}
        <div className="filterpanel-section">
          <label className="filterpanel-label">Keyword Filter</label>
          <div className="filterpanel-keyword-input-container">
            <input
              type="text"
              className="filterpanel-input"
              placeholder="Add keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={keywords.length >= 20}
            />
            <button
              className="filterpanel-add-button"
              onClick={handleAddKeyword}
              disabled={keywords.length >= 20 || !keyword.trim()}
            >
              +
            </button>
          </div>
          {/* Display added keywords */}
          <div className="filterpanel-keywords-list">
            {keywords.map((word) => (
              <div key={word} className="filterpanel-keyword-chip">
                <span>{word}</span>
                <button
                  className="filterpanel-remove-chip"
                  onClick={() => handleRemoveKeyword(word)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="filterpanel-section">
          <div
            className="filterpanel-header"
            onClick={() => toggleExpand('location')}
          >
            <span>Location</span>
            <span>{expanded.location ? '-' : '+'}</span>
          </div>
          {expanded.location && (
            <div className="filterpanel-options">
              {['Show All', ...locationsList].map((loc) => (
                <label key={loc} className="filterpanel-option">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() =>
                      handleMultiSelect(loc, setSelectedLocations, selectedLocations)
                    }
                  />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Filter Options */}
        <div className="filterpanel-section">
          <div
            className="filterpanel-header"
            onClick={() => toggleExpand('filterOptions')}
          >
            <span>Filter Options</span>
            <span>{expanded.filterOptions ? '-' : '+'}</span>
          </div>
          {expanded.filterOptions && (
            <div className="filterpanel-options">
              {['Show All', ...filterOptionsList].map((opt) => (
                <label key={opt} className="filterpanel-option">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(opt)}
                    onChange={() =>
                      handleMultiSelect(opt, setSelectedFilters, selectedFilters)
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Sort By */}
        <div className="filterpanel-section">
          <div
            className="filterpanel-header"
            onClick={() => toggleExpand('sortBy')}
          >
            <span>Sort By</span>
            <span>{expanded.sortBy ? '-' : '+'}</span>
          </div>
          {expanded.sortBy && (
            <div className="filterpanel-options">
              {['Show All', ...sortByList].map((sort) => (
                <label key={sort} className="filterpanel-option">
                  <input
                    type="radio"
                    name="sortBy"
                    checked={selectedSortBy === sort}
                    onChange={() => setSelectedSortBy(sort)}
                  />
                  <span>{sort}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
