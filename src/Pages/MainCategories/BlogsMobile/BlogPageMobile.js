import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './BlogPageMobile.css';
import BlogPostLayout from '../Blogs/BlogPostLayout';
import FilterPanelMobile from "./FilterPanelMobile";
import SearchBarMobile from "../../../Components/SearchBarMobile/SearchBarMobile";
import { FaRegEdit } from "react-icons/fa";

const BlogPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="b-market-container">
      {/* Header */}
      <header className="b-market-header">
        <div className="b-header-content">
          <h1 className="b-title-text">
            BLOG <span className="b-highlight">POSTS</span>
          </h1>
          <p className="b-subtitle-text">AUTOMOTIVE BLOGS</p>
        </div>
        <FaRegEdit className="b-header-logo" />
      </header>

      {/* Search */}
      <SearchBarMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Promoted */}
      <div className="b-promoted-section">
        <h3 className="b-section-label">PROMOTED</h3>
        <div className="b-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <div key={post.id} className="b-card-promoted">
              <BlogPostLayout key={post.id} {...post} />
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="b-main-feed">
        <h3 className="b-section-label">
          ALL LISTINGS ({filteredPosts.length})
        </h3>

        {filteredPosts.map(post => (
          <BlogPostLayout key={post.id} {...post} />
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

export default BlogPageMobile;