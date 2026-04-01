import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./FilterPanelMobile.css";
import PostLocationMultiSelect from "../../../Components/FiltersMobile/PostLocationMultiSelect";

const FilterPanelMobile = ({ show, onClose, searchQuery, setFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);

  // Filters
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  const [dateFilter, setDateFilter] = useState("Show All");

  const [selectedUrgencies, setSelectedUrgencies] = useState([]);
  const [availableUrgencies, setAvailableUrgencies] = useState([]);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [sortBy, setSortBy] = useState("Show All");

  // Fetch posts + extract locations and urgencies
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "request"));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllPosts(posts);

      // Extract unique locations
      const locations = Array.from(new Set(posts.map(p => p.location).filter(Boolean)));
      setAvailableLocations(locations);

      // Extract unique urgencies
      const urgencies = Array.from(
        new Set(posts.map(p => p.urgency).filter(u => u && u.trim() !== ""))
      );
      setAvailableUrgencies(urgencies);
    };

    fetchPosts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allPosts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(p => selectedLocations.includes(p.location));
    }

    // Date filter
    if (dateFilter !== "Show All") {
      const now = new Date();
      filtered = filtered.filter(p => {
        const postDate = new Date(p.createdAt?.seconds * 1000);
        if (dateFilter === "Today") return postDate.toDateString() === now.toDateString();
        if (dateFilter === "This Week") return now - postDate <= 7 * 86400000;
        if (dateFilter === "This Month") return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        if (dateFilter === "Last Three Months") {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return postDate >= threeMonthsAgo && postDate <= now;
        }
        return true;
      });
    }

    // Urgency filter
    if (selectedUrgencies.length > 0) {
      filtered = filtered.filter(p => selectedUrgencies.includes(p.urgency));
    }

    // Price filter
    if (minPrice !== '') {
      filtered = filtered.filter(p => p.price !== undefined && p.price >= Number(minPrice));
    }

    if (maxPrice !== '') {
      filtered = filtered.filter(p => p.price !== undefined && p.price <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === "Newest") filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    if (sortBy === "Oldest") filtered.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
    if (sortBy === "Most Liked") filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    setFilteredPosts(filtered);
  }, [searchQuery, selectedLocations, dateFilter, selectedUrgencies, sortBy, allPosts, setFilteredPosts]);

  if (!show) return null;

  return (
    <div className="r-filter-overlay">
      <div className="r-filter-sheet">
        <div className="r-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="r-filter-sheet-body">

          {/* LOCATION */}
          <div className="r-filter-section">
            <label className="r-filter-label">Post Locations</label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/* DATE */}
          <div className="r-filter-section">
            <label className="r-filter-label">Date Posted</label>

            <select
              className="r-filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option>Show All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Three Months</option>
            </select>
          </div>

          {/* URGENCY */}
          <div className="r-filter-section">
            <label className="r-filter-label">
              Urgency
            </label>
            <div className="r-filter-chip-group">
              {/* Show All */}
              <div
                className={`r-filter-chip ${selectedUrgencies.length === 0 ? "active" : ""}`}
                onClick={() => setSelectedUrgencies([])}
              >
                Show All
              </div>
              {/* All urgency options */}
              {availableUrgencies.map(urgency => (
                <div
                  key={urgency}
                  className={`r-filter-chip ${selectedUrgencies.includes(urgency) ? "active" : ""}`}
                  onClick={() =>
                    setSelectedUrgencies(prev =>
                      prev.includes(urgency)
                        ? prev.filter(u => u !== urgency)
                        : [...prev, urgency]
                    )
                  }
                >
                  {urgency}
                </div>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="r-filter-section">
            <label className="r-filter-label">
              Willing to Pay ($)
            </label>

            <div className="r-filter-price-row">
              <input
                className="r-filter-input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                className="r-filter-input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            
          </div>

          {/* SORT */}
          <div className="r-filter-section">
            <label className="r-filter-label">Sort By</label>

            <select
              className="r-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Show All</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>

          <button className="r-apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;