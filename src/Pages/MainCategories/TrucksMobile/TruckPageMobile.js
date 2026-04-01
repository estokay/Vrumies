import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './TruckPageMobile.css';
import TruckPostLayout from '../Trucks/TruckPostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";

const TruckPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="t-market-container">
      {/* Header */}
      <header className="t-market-header">
        <div className="t-header-content">
          <h1 className="t-title-text">
            TRUCK <span className="t-highlight">POSTS</span>
          </h1>
          <p className="t-subtitle-text">AUTOMOTIVE FREIGHT TRUCKS</p>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/market.png`}
          alt="Icon"
          className="t-header-logo"
        />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="t-promoted-section">
        <h3 className="t-section-label">PROMOTED</h3>
        <div className="t-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="t-card-promoted">
              <TruckPostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="t-main-feed">
        <h3 className="t-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <TruckPostLayout key={post.id} {...post} />
        ))}
      </div>

      {/* Filter Panel */}
      <FilterPanelMobile
        show={showFilters}
        onClose={() => setShowFilters(false)}
        searchQuery={searchQuery}
        setAllPosts={setAllPosts}
        setFilteredPosts={setFilteredPosts}
      />
    </div>
  );
};

export default TruckPageMobile;