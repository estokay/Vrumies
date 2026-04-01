import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './RequestPageMobile.css';
import RequestPostLayout from '../Requests/RequestPostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";

const RequestPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="r-market-container">
      {/* Header */}
      <header className="r-market-header">
        <div className="r-header-content">
          <h1 className="r-title-text">
            REQUEST <span className="r-highlight">POSTS</span>
          </h1>
          <p className="r-subtitle-text">AUTOMOTIVE REQUESTS</p>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/market.png`}
          alt="Icon"
          className="r-header-logo"
        />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="r-promoted-section">
        <h3 className="r-section-label">PROMOTED</h3>
        <div className="r-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="r-card-promoted">
              <RequestPostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="r-main-feed">
        <h3 className="r-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <RequestPostLayout key={post.id} {...post} />
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

export default RequestPageMobile;