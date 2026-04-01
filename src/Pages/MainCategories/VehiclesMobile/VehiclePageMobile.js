import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './VehiclePageMobile.css';
import VehiclePostLayout from '../Vehicles/VehiclePostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";

const VehiclePageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="v-market-container">
      {/* Header */}
      <header className="v-market-header">
        <div className="v-header-content">
          <h1 className="v-title-text">
            VEHICLE <span className="v-highlight">POSTS</span>
          </h1>
          <p className="v-subtitle-text">AUTOMOTIVE VEHICLES</p>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/market.png`}
          alt="Icon"
          className="v-header-logo"
        />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="v-promoted-section">
        <h3 className="v-section-label">PROMOTED</h3>
        <div className="v-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="v-card-promoted">
              <VehiclePostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="v-main-feed">
        <h3 className="v-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <VehiclePostLayout key={post.id} {...post} />
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

export default VehiclePageMobile;