import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./FilterPanelMobile.css";
import PostLocationMultiSelect from "../../../Components/FiltersMobile/PostLocationMultiSelect";

const FilterPanelMobile = ({
  show,
  onClose,
  searchQuery,
  setAllPosts,
  setFilteredPosts
}) => {
  const [allPostsLocal, setAllPostsLocal] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  // Filters
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [serviceLocation, setServiceLocation] = useState("Show All");
  const [dateFilter, setDateFilter] = useState("Show All");
  const [sortBy, setSortBy] = useState("Show All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const parsePrice = (price) => {
    if (!price) return null;
    const num = Number(price.toString().replace(/[^0-9.]/g, ""));
    return isNaN(num) ? null : num;
  };

  // Fetch posts + locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "directory"));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAllPostsLocal(posts);
      setAllPosts(posts);

      // Extract unique locations
      const locations = Array.from(new Set(posts.map(p => p.location).filter(Boolean)));
      setAvailableLocations(locations);
    };

    fetchPosts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allPostsLocal];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p => (p.title || "").toLowerCase().includes(q) ||
             (p.description || "").toLowerCase().includes(q)
      );
    }

    // Post locations
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(p => selectedLocations.includes(p.location));
    }

    // Service location
    if (serviceLocation !== "Show All") {
      filtered = filtered.filter(p => p.serviceLocation === serviceLocation);
    }

    // Price
    if (minPrice) {
      filtered = filtered.filter(p => {
        const priceNum = parsePrice(p.price);
        return priceNum !== null && priceNum >= Number(minPrice);
      });
    }

    if (maxPrice) {
      filtered = filtered.filter(p => {
        const priceNum = parsePrice(p.price);
        return priceNum !== null && priceNum <= Number(maxPrice);
      });
    }

    // Date filter
    if (dateFilter !== "Show All") {
      const now = new Date();
      filtered = filtered.filter(p => {
        const postDate = new Date(p.createdAt?.seconds * 1000);
        if (dateFilter === "Today") return postDate.toDateString() === now.toDateString();
        if (dateFilter === "This Week") return now - postDate <= 7 * 86400000;
        if (dateFilter === "This Month")
          return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        if (dateFilter === "Last Three Months") {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return postDate >= threeMonthsAgo && postDate <= now;
        }
        return true;
      });
    }

    // Sorting
    if (sortBy === "Newest") {
      filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
    if (sortBy === "Oldest") {
      filtered.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    }
    if (sortBy === "Most Liked") {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    setFilteredPosts(filtered);
  }, [
    searchQuery,
    selectedLocations,
    serviceLocation,
    dateFilter,
    minPrice,
    maxPrice,
    sortBy,
    allPostsLocal,
    setFilteredPosts
  ]);

  if (!show) return null;

  return (
    <div className="d-filter-overlay">
      <div className="d-filter-sheet">
        <div className="d-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="d-filter-sheet-body">
          {/* Post Locations */}
          <div className="d-filter-group">
            <label>
              Post Locations
            </label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/* Service Location */}
          <div className="d-filter-group">
            <label>
              Service Location
            </label>
              <div className="d-radio-group">
                {["Show All", "Customer Address", "Business Address"].map(opt => (
                  <button
                    key={opt}
                    className={serviceLocation === opt ? "active" : ""}
                    onClick={() => setServiceLocation(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
          </div>

          {/* Date */}
          <div className="d-filter-group">
            <label>
              Date Posted
            </label>
              <select
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

          {/* Price */}
          <div className="d-filter-group">
            <label>
              Price
            </label>
              <div className="d-price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
          </div>

          {/* Sort */}
          <div className="d-filter-group">
            <label>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Show All</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>

          <button className="d-apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;