import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./FilterPanelMobile.css";

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
  const [categoryFilter, setCategoryFilter] = useState("Show All");

  // Fetch bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      // Logic for fetching bookmarks (e.g., from a 'Bookmarks' collection or specific user doc)
      const ref = collection(db, "Posts"); 
      const q = query(ref, where("type", "==", "market")); // Update this query as needed for bookmarks
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAllPostsLocal(posts);
      setAllPosts(posts);
    };

    fetchBookmarks();
  }, [setAllPosts]);

  // Filtering logic
  useEffect(() => {
    let result = [...allPostsLocal];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.title || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "Newest") {
      result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }

    if (sortBy === "Most Liked") {
      result.sort((a, b) => (b.likesCounter || 0) - (a.likesCounter || 0));
    }

    setFilteredPosts(result);
  }, [searchQuery, sortBy, allPostsLocal, setFilteredPosts]);

  if (!show) return null;

  return (
    <div className="bookmarksmobile-filter-overlay" onClick={onClose}>
      <div className="bookmarksmobile-filter-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="bookmarksmobile-filter-sheet-header">
          <h3>Filter Bookmarks</h3>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>

        <div className="bookmarksmobile-filter-sheet-body">
          {/* Sort */}
          <div className="bookmarksmobile-filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Show All</option>
              <option>Newest</option>
              <option>Most Liked</option>
            </select>
          </div>

          {/* Type Toggle - Example for Bookmarks */}
          <div className="bookmarksmobile-filter-group">
            <label>View Type</label>
            <div className="bookmarksmobile-radio-group">
              {["Show All", "Posts", "Market"].map(c => (
                <button
                  key={c}
                  className={categoryFilter === c ? "active" : ""}
                  onClick={() => setCategoryFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button className="bookmarksmobile-apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;