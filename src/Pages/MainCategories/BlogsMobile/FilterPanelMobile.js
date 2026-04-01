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
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState("Show All");

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "blog"));
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
  }, []);

  // Filtering logic
  useEffect(() => {
    let result = [...allPostsLocal];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.title || "").toLowerCase().includes(q)
      );
    }

    // 📍 LOCATION FILTER
    if (selectedLocations.length > 0) {
      result = result.filter(p =>
        selectedLocations.includes(p.location)
      );
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

    if (sortBy === "Newest") {
      result.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );
    }

    if (sortBy === "Oldest") {
      result.sort(
        (a, b) =>
          (a.createdAt?.seconds || 0) -
          (b.createdAt?.seconds || 0)
      );
    }

    if (sortBy === "Most Liked") {
      result.sort(
        (a, b) =>
          (b.likesCounter || 0) -
          (a.likesCounter || 0)
      );
    }

    setFilteredPosts(result); // send to parent
  }, [searchQuery, sortBy, dateFilter, selectedLocations, allPostsLocal]);

  if (!show) return null;

  return (
    <div className="b-filter-overlay">
      <div className="b-filter-sheet">
        <div className="b-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="b-filter-sheet-body">

          {/* Post Locations */}
          <div className="b-filter-group">
            <label>Post Locations</label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/* Date Posted */}
          <div className="b-filter-group">
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
          <div className="b-filter-group">
            <label>Sort By</label>
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

          <button className="b-apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;