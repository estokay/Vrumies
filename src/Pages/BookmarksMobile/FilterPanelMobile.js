import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../Components/firebase";
import { collection, getDocs, query, doc, getDoc, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./FilterPanelMobile.css";

const FilterPanelMobile = ({
  show,
  onClose,
  searchQuery,
  setAllPosts,
  setFilteredPosts
}) => {
  const [allPostsLocal, setAllPostsLocal] = useState([]);
  const [selectedPostTypes, setSelectedPostTypes] = useState([]);
  const [dateFilter, setDateFilter] = useState("Show All");

  const POST_TYPES = [
  { label: "Video", value: "video" },
  { label: "Blog", value: "blog" },
  { label: "Event", value: "event" },
  { label: "Request", value: "request" },
  { label: "Market", value: "market" },
  { label: "Directory", value: "directory" },
  { label: "Trucks", value: "trucks" },
  { label: "Vehicle", value: "vehicle" },
  { label: "Loads", value: "loads" },
  { label: "Offer", value: "offer" },
];

  // Filters
  const [sortBy, setSortBy] = useState("Show All");

  // Fetch bookmarks
  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setAllPostsLocal([]);
          setAllPosts([]);
          return;
        }

        // 🔹 Get user doc
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);

        const bookmarkedIds =
          (userSnap.exists() && userSnap.data().bookmarks) || [];

        if (bookmarkedIds.length === 0) {
          setAllPostsLocal([]);
          setAllPosts([]);
          return;
        }

        const postsRef = collection(db, "Posts");
        const bookmarkedPosts = [];

        const chunkSize = 10; // Firestore limit
        for (let i = 0; i < bookmarkedIds.length; i += chunkSize) {
          const chunk = bookmarkedIds.slice(i, i + chunkSize);
          const q = query(postsRef, where("__name__", "in", chunk));
          const snap = await getDocs(q);

          snap.forEach(doc => {
            bookmarkedPosts.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        }

        setAllPostsLocal(bookmarkedPosts);
        setAllPosts(bookmarkedPosts);

      } catch (err) {
        console.error("Error fetching bookmarked posts:", err);
        setAllPostsLocal([]);
        setAllPosts([]);
      }
    };

    fetchBookmarkedPosts();
  }, [setAllPosts]);

  // Filtering logic
  useEffect(() => {
    let result = [...allPostsLocal];

    // 🔍 SEARCH
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }

    // 🧠 POST TYPE FILTER
    if (selectedPostTypes.length > 0) {
      result = result.filter(p =>
        selectedPostTypes.includes((p.type || "").toLowerCase())
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

    // 🔽 SORTING
    if (sortBy === "Newest") {
      result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }

    if (sortBy === "Oldest") {
      result.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    }

    if (sortBy === "Most Liked") {
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    setFilteredPosts(result);

  }, [searchQuery, sortBy, selectedPostTypes, dateFilter, allPostsLocal, setFilteredPosts]);

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
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>

          {/* Date Posted */}
          <div className="bookmarksmobile-filter-group">
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

          {/* Type Toggle - Example for Bookmarks */}
          <div className="bookmarksmobile-filter-group">
            <label>Post Types</label>

            <div className="bookmarksmobile-radio-group">
              {/* SHOW ALL */}
              <button
                className={selectedPostTypes.length === 0 ? "active" : ""}
                onClick={() => setSelectedPostTypes([])}
              >
                Show All
              </button>

              {POST_TYPES.map(item => (
                <button
                  key={item.value}
                  className={selectedPostTypes.includes(item.value) ? "active" : ""}
                  onClick={() =>
                    setSelectedPostTypes(prev =>
                      prev.includes(item.value)
                        ? prev.filter(t => t !== item.value)
                        : [...prev, item.value]
                    )
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;