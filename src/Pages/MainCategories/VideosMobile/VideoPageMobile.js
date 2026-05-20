import React, { useState } from 'react';
import { FaVideo  } from 'react-icons/fa';
import './VideoPageMobile.css';
import VideosPostLayout from '../Videos/VideosPostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";

const VideoPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="videos-market-container">
      {/* Header */}
      <header className="videos-market-header">
        <div className="videos-header-content">
          <h1 className="videos-title-text">
            VIDEO <span className="videos-highlight">POSTS</span>
          </h1>
          <p className="videos-subtitle-text">AUTOMOTIVE VIDEOS</p>
        </div>
        <FaVideo
          size={50}
          color="#39FF14"
          className="videos-header-logo"
          style={{
            filter: "drop-shadow(0 0 6px #000000ff)",
          }}
        />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="videos-promoted-section">
        <h3 className="videos-section-label">PROMOTED</h3>
        <div className="videos-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="videos-card-promoted">
              <VideosPostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="videos-main-feed">
        <h3 className="videos-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <VideosPostLayout key={post.id} {...post} />
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

export default VideoPageMobile;