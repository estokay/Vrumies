import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './LoadPageMobile.css';
import LoadPostLayout from '../Loads/LoadPostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";

const LoadPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="l-market-container">
      {/* Header */}
      <header className="l-market-header">
        <div className="l-header-content">
          <h1 className="l-title-text">
            LOAD <span className="l-highlight">POSTS</span>
          </h1>
          <p className="l-subtitle-text">AUTOMOTIVE LOADS</p>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/market.png`}
          alt="Icon"
          className="l-header-logo"
        />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="l-promoted-section">
        <h3 className="l-section-label">PROMOTED</h3>
        <div className="l-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="l-card-promoted">
              <LoadPostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="l-main-feed">
        <h3 className="l-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <LoadPostLayout key={post.id} {...post} />
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

export default LoadPageMobile;