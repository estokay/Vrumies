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

  // Filters
  const [sortBy, setSortBy] = useState("Show All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [conditionFilter, setConditionFilter] = useState("Show All");
  const [dateFilter, setDateFilter] = useState("Show All");

  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const [availableShippingTimes, setAvailableShippingTimes] = useState([]);
  const [selectedShippingTimes, setSelectedShippingTimes] = useState([]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "market"));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAllPostsLocal(posts);
      setAllPosts(posts);

      setAvailableLocations([
        ...new Set(posts.map(p => p.location).filter(Boolean))
      ]);

      setAvailableShippingTimes([
        ...new Set(posts.map(p => p.shippingTime).filter(Boolean))
      ]);
    };

    fetchPosts();
  }, []);

  const parsePrice = (price) => {
    if (typeof price === "number") return price;  // already a number
    if (typeof price === "string") {
      const num = Number(price.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? null : num;
    }
    return null;
  };

  // Filtering logic
  useEffect(() => {
    let result = [...allPostsLocal];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }

    // Locations
    if (selectedLocations.length > 0) {
      result = result.filter(p =>
        selectedLocations.includes(p.location)
      );
    }

    // Price
    if (minPrice !== "") {
      result = result.filter(p => {
        const price = parsePrice(p.price);
        return price !== null && price >= Number(minPrice);
      });
    }

    if (maxPrice !== "") {
      result = result.filter(p => {
        const price = parsePrice(p.price);
        return price !== null && price <= Number(maxPrice);
      });
    }

    // Condition
    if (conditionFilter !== "Show All") {
      result = result.filter(p => p.condition === conditionFilter);
    }

    // Shipping
    if (selectedShippingTimes.length > 0) {
      result = result.filter(p =>
        selectedShippingTimes.includes(p.shippingTime)
      );
    }

    // Date
    if (dateFilter !== "Show All") {
      const now = new Date();

      result = result.filter(p => {
        const postDate = new Date(p.createdAt?.seconds * 1000);

        if (dateFilter === "Today") {
          return postDate.toDateString() === now.toDateString();
        }
        if (dateFilter === "This Week") {
          return now - postDate <= 7 * 86400000;
        }
        if (dateFilter === "This Month") {
          return (
            postDate.getMonth() === now.getMonth() &&
            postDate.getFullYear() === now.getFullYear()
          );
        }
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
      result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    }

    if (sortBy === "Oldest") {
      result.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
    }

    if (sortBy === "Most Liked") {
      result.sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    }

    setFilteredPosts(result);
  }, [
    searchQuery,
    sortBy,
    minPrice,
    maxPrice,
    conditionFilter,
    selectedLocations,
    selectedShippingTimes,
    dateFilter,
    allPostsLocal
  ]);

  if (!show) return null;

  return (
    <div className="mpf-overlay">
      <div className="mpf-sheet">

        <div className="mpf-header">
          <h3>Filters</h3>
          <FaTimes className="mpf-close" onClick={onClose} />
        </div>

        {/* SORT */}
        <div className="mpf-group">
          <div className="mpf-group-title">Sort By</div>
          <select
            className="mpf-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Show All</option>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Most Liked</option>
          </select>
        </div>

        {/* DATE POSTED */}
        <div className="mpf-group">
          <div className="mpf-group-title">Date Posted</div>
          <select
            className="mpf-select"
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

        {/* LOCATIONS */}
        <div className="mpf-group">
          <div className="mpf-group-title">Locations</div>
          <PostLocationMultiSelect
            options={availableLocations}
            selected={selectedLocations}
            onChange={setSelectedLocations}
          />
        </div>

        {/* SHIPPING */}
        <div className="mpf-group">
          <div className="mpf-group-title">Shipping Time</div>
          <div className="mpf-chip-group">
            {availableShippingTimes.map(time => (
              <div
                key={time}
                className={`mpf-chip ${selectedShippingTimes.includes(time) ? "active" : ""}`}
                onClick={() =>
                  setSelectedShippingTimes(prev =>
                    prev.includes(time)
                      ? prev.filter(t => t !== time)
                      : [...prev, time]
                  )
                }
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* CONDITION */}
        <div className="mpf-group">
          <div className="mpf-group-title">Condition</div>
          <div className="mpf-radio-group">
            {["Show All", "New", "Used"].map(c => (
              <button
                key={c}
                className={`mpf-radio-btn ${conditionFilter === c ? "active" : ""}`}
                onClick={() => setConditionFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className="mpf-group">
          <div className="mpf-group-title">Price Range</div>
          <div className="mpf-price-row">
            <input
              className="mpf-input"
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              className="mpf-input"
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <button className="mpf-apply" onClick={onClose}>
          Apply Filters
        </button>

      </div>
    </div>
  );
};

export default FilterPanelMobile;