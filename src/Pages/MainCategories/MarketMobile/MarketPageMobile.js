import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './MarketPageMobile.css';
import MarketPostLayout from '../Market/MarketPostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";

const MarketPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="m-market-container">
      {/* Header */}
      <header className="m-market-header">
        <div className="m-header-content">
          <h1 className="m-title-text">
            MARKET <span className="m-highlight">POSTS</span>
          </h1>
          <p className="m-subtitle-text">AUTOMOTIVE MARKETPLACE</p>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/market.png`}
          alt="Icon"
          className="m-header-logo"
        />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="m-promoted-section">
        <h3 className="m-section-label">PROMOTED</h3>
        <div className="m-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="m-card-promoted">
              <MarketPostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="m-main-feed">
        <h3 className="m-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <MarketPostLayout key={post.id} {...post} />
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

export default MarketPageMobile;