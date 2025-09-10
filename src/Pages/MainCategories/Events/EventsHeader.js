import React, { useState } from 'react';
import './EventsHeader.css';

const EventsHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div className="events-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">EVENT POSTS</span>
        </h1>
        <p className="subtitle">PROMOTE AND SHARE YOUR AUTOMOTIVE EVENTS</p>
      </div>

      <div className="right-side">
        <img
          src={`${process.env.PUBLIC_URL}/request-icon.png`}
          alt="Events Icon"
          width="70"
          height="70"
          className="events-icon"
        />
      </div>

      <div className="bottom-bar">
        {/* Location Dropdown */}
        <div className="select-wrapper">
          <label className="select-label">Location of Post</label>
          <select
            className="select location-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option>Show All</option>
            <option>Houston, TX</option>
            <option>Dallas, TX</option>
            <option>San Antonio, TX</option>
          </select>
        </div>

        {/* Filter Dropdown */}
        <div className="select-wrapper">
          <label className="select-label">Filter Options</label>
          <select
            className="select filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Show All</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="select-wrapper">
          <label className="select-label">Sort By</label>
          <select
            className="select sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Show All</option>
            <option>Newest</option>
            <option>Likes</option>
            <option>Highest Rating</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="search-wrapper">
          <label className="select-label">Search</label>
          <input
            type="search"
            placeholder="Type your search here..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsHeader;
