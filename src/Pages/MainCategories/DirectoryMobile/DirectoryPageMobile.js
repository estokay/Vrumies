import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './DirectoryPageMobile.css';
import DirectoryPostLayout from '../Directory/DirectoryPostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";

const DirectoryPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="d-market-container">
      {/* Header */}
      <header className="d-market-header">
        <div className="d-header-content">
          <h1 className="d-title-text">
            DIRECTORY <span className="d-highlight">POSTS</span>
          </h1>
          <p className="d-subtitle-text">AUTOMOTIVE DIRECTORY</p>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/market.png`}
          alt="Icon"
          className="d-header-logo"
        />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="d-promoted-section">
        <h3 className="d-section-label">PROMOTED</h3>
        <div className="d-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="d-card-promoted">
              <DirectoryPostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="d-main-feed">
        <h3 className="d-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <DirectoryPostLayout key={post.id} {...post} />
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

export default DirectoryPageMobile;