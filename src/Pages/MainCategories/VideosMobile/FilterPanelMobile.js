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
  const [dateFilter, setDateFilter] = useState("Show All");
  // Post Locations
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [openLocations, setOpenLocations] = useState(false);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "video"));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAvailableLocations([
        ...new Set(posts.map(p => p.location).filter(Boolean))
      ]);

      setAllPostsLocal(posts);
      setAllPosts(posts); // send to parent
    };

    fetchPosts();
  }, [setAllPosts]);

  // Filtering logic
  useEffect(() => {
    let result = [...allPostsLocal];

    // 🔹 Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Post Locations
    if (selectedLocations.length > 0) {
      result = result.filter(p => selectedLocations.includes(p.location));
    }

    // 📅 DATE FILTER
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

    // 🔹 Sorting
    if (sortBy === "Newest") {
      result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
    if (sortBy === "Oldest") {
      result.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    }
    if (sortBy === "Most Liked") {
      result.sort((a, b) => (b.likesCounter || 0) - (a.likesCounter || 0));
    }

    setFilteredPosts(result);
  }, [searchQuery, sortBy, dateFilter, selectedLocations, allPostsLocal, setFilteredPosts]);

  if (!show) return null;

  return (
    <div className="videos-filter-overlay">
      <div className="videos-filter-sheet">
        <div className="videos-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        <div className="videos-filter-sheet-body">

          {/* POST LOCATIONS */}
          <div className="videos-filter-group">
            <label>Post Locations</label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/* Date Posted */}
          <div className="videos-filter-group">
            <label>Date Posted</label>

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

          {/* Sort */}
          <div className="videos-filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Show All</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>

          <button className="videos-apply-btn" onClick={onClose}>
            Apply Filters
          </button>

        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;