import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [conditionFilter, setConditionFilter] = useState("Show All");

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "vehicle"));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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

    const getPrice = (price) =>
      parseFloat((price || "").replace(/[^0-9.]/g, "")) || 0;

    if (minPrice)
      result = result.filter(p => getPrice(p.price) >= Number(minPrice));

    if (maxPrice)
      result = result.filter(p => getPrice(p.price) <= Number(maxPrice));

    if (conditionFilter !== "Show All") {
      result = result.filter(p => p.condition === conditionFilter);
    }

    if (sortBy === "Newest") {
      result.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
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
  }, [searchQuery, sortBy, minPrice, maxPrice, conditionFilter, allPostsLocal]);

  if (!show) return null;

  return (
    <div className="v-filter-overlay">
      <div className="v-filter-sheet">
        <div className="v-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="v-filter-sheet-body">
          {/* Sort */}
          <div className="v-filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Show All</option>
              <option>Newest</option>
              <option>Most Liked</option>
            </select>
          </div>

          {/* Condition */}
          <div className="v-filter-group">
            <label>Condition</label>
            <div className="v-radio-group">
              {["Show All", "New", "Used"].map(c => (
                <button
                  key={c}
                  className={conditionFilter === c ? "active" : ""}
                  onClick={() => setConditionFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="v-filter-group">
            <label>Price Range</label>
            <div className="v-price-inputs">
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

          <button className="v-apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;