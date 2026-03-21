import React, { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { FaComment, FaFilter, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useUserAverageRating from "../../../Components/Reviews/useUserAverageRating";
import './MarketPageMobile.css';
import MarketPostLayout from '../Market/MarketPostLayout';

const MarketPageMobile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [conditionFilter, setConditionFilter] = useState('Show All');

  // Fetch Data
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'market'));
      const snap = await getDocs(q);
      const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setAllPosts(posts);
      setAvailableLocations(Array.from(new Set(posts.map(p => p.location).filter(Boolean))));
    };
    fetchPosts();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = [...allPosts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => (p.title || '').toLowerCase().includes(q));
    }

    if (selectedLocations.length > 0) {
      result = result.filter(p => selectedLocations.includes(p.location));
    }

    if (minPrice) result = result.filter(p => parseFloat(p.price?.replace(/[^0-9.]/g, '')) >= Number(minPrice));
    if (maxPrice) result = result.filter(p => parseFloat(p.price?.replace(/[^0-9.]/g, '')) <= Number(maxPrice));

    if (conditionFilter !== 'Show All') {
      result = result.filter(p => p.condition === conditionFilter);
    }

    if (sortBy === 'Newest') result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    if (sortBy === 'Most Liked') result.sort((a, b) => (b.likesCounter || 0) - (a.likesCounter || 0));

    setFilteredPosts(result);
  }, [searchQuery, selectedLocations, dateFilter, sortBy, minPrice, maxPrice, conditionFilter, allPosts]);

  return (
    <div className="m-market-container">
      {/* Mobile Header */}
      <header className="m-market-header">
        <div className="m-header-content">
          <h1 className="m-title-text">MARKET <span className="m-highlight">POSTS</span></h1>
          <p className="m-subtitle-text">AUTOMOTIVE MARKETPLACE</p>
        </div>
        <img src={`${process.env.PUBLIC_URL}/category-icons/market.png`} alt="Icon" className="m-header-logo" />
      </header>

      {/* Search and Filter Toggle */}
      <div className="m-search-bar-row">
        <input 
          className="m-search-input-field"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="m-filter-toggle-btn" onClick={() => setShowFilters(true)}>
          <FaFilter />
        </button>
      </div>

      {/* Promoted Section (Horizontal Scroll) */}
      <div className="m-promoted-section">
        <h3 className="m-section-label">PROMOTED</h3>
        <div className="m-promoted-scroll">
          {allPosts.filter(p => p.tokens > 0).map(post => (
            <MarketPostLayout
                key={post.id}
                id={post.id}
                images={post.images}
                title={post.title}
                createdAt={post.createdAt}
                userId={post.userId}
                price={post.price}
            />
          ))}
        </div>
      </div>

      {/* Main Feed */}
      <div className="m-main-feed">
        <h3 className="m-section-label">ALL LISTINGS ({filteredPosts.length})</h3>
        {filteredPosts.map(post => (
          <MarketPostLayout
            key={post.id}
            id={post.id}
            images={post.images}
            title={post.title}
            createdAt={post.createdAt}
            userId={post.userId}
            price={post.price}
          />
        ))}
      </div>

      {/* Filter Overlay */}
      {showFilters && (
        <div className="m-filter-overlay">
          <div className="m-filter-sheet">
            <div className="m-filter-sheet-header">
              <h3>Filters</h3>
              <FaTimes onClick={() => setShowFilters(false)} />
            </div>
            <div className="m-filter-sheet-body">
              <div className="m-filter-group">
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option>Show All</option>
                  <option>Newest</option>
                  <option>Most Liked</option>
                </select>
              </div>
              <div className="m-filter-group">
                <label>Condition</label>
                <div className="m-radio-group">
                  {['Show All', 'New', 'Used'].map(c => (
                    <button key={c} className={conditionFilter === c ? 'active' : ''} onClick={() => setConditionFilter(c)}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="m-filter-group">
                <label>Price Range</label>
                <div className="m-price-inputs">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <button className="m-apply-btn" onClick={() => setShowFilters(false)}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual post cards
const MobilePostCard = ({ post, isPromoted }) => {
  const averageRating = useUserAverageRating(post.userId);
  
  return (
    <Link to={`/marketpost/${post.id}`} className={`m-card ${isPromoted ? 'm-card-promoted' : ''}`}>
      <div className="m-card-thumb-wrap">
        <img src={post.images?.[0]} alt={post.title} className="m-card-img" />
        <span className="m-card-price-tag">{post.price}</span>
        {isPromoted && <span className="m-promoted-tag">PROMOTED</span>}
      </div>
      <div className="m-card-details">
        <h4 className="m-card-title">{post.title}</h4>
        <div className="m-card-stats">
            <span>⭐ {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</span>
            <span><FaComment /> {post.tokens || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default MarketPageMobile;