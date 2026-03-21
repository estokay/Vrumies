import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './BookmarksPageMobile.css';
import PostRenderer from '../../Components/PostLayouts/PostRenderer';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../Components/SearchBarMobile/SearchBarMobile";

const BookmarksPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Derived logic for promoted posts (matching Market layout)
  const promotedPosts = allPosts.filter(p => (p.tokens || 0) > 0);

  return (
    <div className="bookmarksmobile-bookmarks-container">
      {/* Header - Styled like Market */}
      <header className="bookmarksmobile-bookmarks-header">
        <div className="bookmarksmobile-header-content">
          <h1 className="bookmarksmobile-title-text">
            BOOK <span className="bookmarksmobile-highlight">MARKS</span>
          </h1>
          <p className="bookmarksmobile-subtitle-text">YOUR SAVED CONTENT</p>
        </div>
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/bookmark.png`}
          alt="Icon"
          className="bookmarksmobile-header-logo"
        />
      </header>

      {/* Search Bar - Matching Market style */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted Section - Horizontal Scroll */}
      {promotedPosts.length > 0 && (
        <div className="bookmarksmobile-promoted-section">
          <h3 className="bookmarksmobile-section-label">PROMOTED</h3>
          <div className="bookmarksmobile-promoted-scroll">
            {promotedPosts.map(post => (
              <div key={post.id} className="bookmarksmobile-promoted-card-wrapper">
                 <PostRenderer post={{ ...post, compact: true }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Feed - Vertical List */}
      <div className="bookmarksmobile-main-feed">
        <h3 className="bookmarksmobile-section-label">
          ALL BOOKMARKS ({filteredPosts.length})
        </h3>

        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="bookmarksmobile-feed-item">
              <PostRenderer post={post} />
            </div>
          ))
        ) : (
          <p className="bookmarksmobile-empty-msg">No bookmarks found.</p>
        )}
      </div>

      {/* Filter Panel - Slide up Overlay */}
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

export default BookmarksPageMobile;