import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CalendarDateRangeOverlay from "../../../Components/Overlays/CalendarDateRangeOverlay";
import { format } from "date-fns";
import "./FilterPanelMobile.css";
import PostLocationMultiSelect from "../../../Components/FiltersMobile/PostLocationMultiSelect";

const FilterPanelMobile = ({
  show,
  onClose,
  searchQuery = "",
  setFilteredPosts,
}) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState("Show All");
  const [sortBy, setSortBy] = useState("Show All");
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [showDateOverlay, setShowDateOverlay] = useState(false);

  // 🔹 Fetch posts and extract unique locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "event"));
      const snap = await getDocs(q);

      const posts = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllPosts(posts);

      const locations = Array.from(
        new Set(posts.map((p) => p.location).filter(Boolean))
      );
      setAvailableLocations(locations);
    };

    fetchPosts();
  }, []);

  // 🔹 Filtering logic
  useEffect(() => {
    let filtered = [...allPosts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((p) => selectedLocations.includes(p.location));
    }

    // Date Posted filter
    if (dateFilter !== "Show All") {
      const now = new Date();
      filtered = filtered.filter((p) => {
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

    // Event Date Range filter
    if (dateRange.from && dateRange.to) {
      const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const start = normalize(dateRange.from);
      const end = normalize(dateRange.to);

      filtered = filtered.filter((p) => {
        if (!p.eventDateTime?.seconds) return false;
        const eventDate = normalize(new Date(p.eventDateTime.seconds * 1000));
        return eventDate >= start && eventDate <= end;
      });
    }

    // Sorting
    if (sortBy === "Newest") filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    if (sortBy === "Oldest") filtered.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
    if (sortBy === "Most Liked") filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    setFilteredPosts(filtered);
  }, [allPosts, searchQuery, selectedLocations, dateFilter, dateRange, sortBy, setFilteredPosts]);

  if (!show) return null;

  return (
    <div className="events-filter-overlay">
      <div className="events-filter-sheet">
        <div className="events-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="events-filter-sheet-body">
          {/* Locations */}
          <div className="events-filter-group">
            <label>Post Locations</label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/* Date Posted */}
          <div className="events-filter-group">
            <label>Date Posted</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option>Show All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Three Months</option>
            </select>
          </div>

          {/* Event Date Range */}
          <div className="events-filter-group">
            <label>Event Date Range</label>
            <button
              className="events-date-btn"
              onClick={() => setShowDateOverlay(true)}
            >
              📅 Select Date Range
            </button>

            {dateRange.from && (
              <div className="events-date-selected">
                {format(dateRange.from, "MM/dd/yyyy")}
                {dateRange.to ? ` - ${format(dateRange.to, "MM/dd/yyyy")}` : ""}
                <button onClick={() => setDateRange({ from: undefined, to: undefined })}>✕</button>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="events-filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Show All</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>

          <button className="events-apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>

        {showDateOverlay && (
          <CalendarDateRangeOverlay range={dateRange} setRange={setDateRange} onClose={() => setShowDateOverlay(false)} />
        )}
      </div>
    </div>
  );
};

export default FilterPanelMobile;