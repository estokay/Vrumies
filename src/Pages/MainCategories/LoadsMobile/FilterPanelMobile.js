import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CalendarDateRangeOverlay from "../../../Components/Overlays/CalendarDateRangeOverlay";
import "./FilterPanelMobile.css";
import PostLocationMultiSelect from "../../../Components/FiltersMobile/PostLocationMultiSelect";

const FilterPanelMobile = ({ show, onClose, searchQuery, setFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);

  // Filters state
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState("Show All");
  const [availableRange, setAvailableRange] = useState();
  const [showCalendar, setShowCalendar] = useState(false);

  const [minPayout, setMinPayout] = useState("");
  const [maxPayout, setMaxPayout] = useState("");

  const [minLoadLength, setMinLoadLength] = useState("");
  const [maxLoadLength, setMaxLoadLength] = useState("");

  const [minLoadWeight, setMinLoadWeight] = useState("");
  const [maxLoadWeight, setMaxLoadWeight] = useState("");

  const [selectedTruckTypes, setSelectedTruckTypes] = useState([]);
  const [selectedPickupCities, setSelectedPickupCities] = useState([]);
  const [selectedDropoffCities, setSelectedDropoffCities] = useState([]);

  const [sortBy, setSortBy] = useState("Show All");

  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTruckTypes, setAvailableTruckTypes] = useState([]);
  const [availablePickupCities, setAvailablePickupCities] = useState([]);
  const [availableDropoffCities, setAvailableDropoffCities] = useState([]);

  // 🔹 Fetch posts and extract unique values
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "loads"));
      const snap = await getDocs(q);

      const posts = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllPosts(posts);

      setAvailableLocations(Array.from(new Set(posts.map((p) => p.location).filter(Boolean))));
      setAvailableTruckTypes(Array.from(new Set(posts.map((p) => p.truckType).filter(Boolean))));
      setAvailablePickupCities(Array.from(new Set(posts.map((p) => p.pickupCity).filter(Boolean))));
      setAvailableDropoffCities(Array.from(new Set(posts.map((p) => p.dropoffCity).filter(Boolean))));
    };

    fetchPosts();
  }, []);

  // 🔹 Apply filters
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

    // Locations
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((p) => selectedLocations.includes(p.location));
    }

    // Payout
    if (minPayout !== "") filtered = filtered.filter((p) => p.payout >= Number(minPayout));
    if (maxPayout !== "") filtered = filtered.filter((p) => p.payout <= Number(maxPayout));

    // Load Length
    if (minLoadLength !== "")
      filtered = filtered.filter((p) => p.loadLength >= Number(minLoadLength));
    if (maxLoadLength !== "")
      filtered = filtered.filter((p) => p.loadLength <= Number(maxLoadLength));

    // Load Weight
    if (minLoadWeight !== "")
      filtered = filtered.filter((p) => p.loadWeight >= Number(minLoadWeight));
    if (maxLoadWeight !== "")
      filtered = filtered.filter((p) => p.loadWeight <= Number(maxLoadWeight));

    // Truck Types
    if (selectedTruckTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTruckTypes.includes(p.truckType));
    }

    // Pickup Cities
    if (selectedPickupCities.length > 0) {
      filtered = filtered.filter((p) => selectedPickupCities.includes(p.pickupCity));
    }

    // Dropoff Cities
    if (selectedDropoffCities.length > 0) {
      filtered = filtered.filter((p) => selectedDropoffCities.includes(p.dropoffCity));
    }

    // Date Filter
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

    // Available Date Range
    if (availableRange?.from) {
      filtered = filtered.filter((post) => {
        if (!post.availableDate || typeof post.availableDate.toDate !== "function") return false;
        const available = post.availableDate.toDate();
        if (!availableRange.to) return available.toDateString() === availableRange.from.toDateString();
        return available >= availableRange.from && available <= availableRange.to;
      });
    }

    // Sorting
    if (sortBy === "Newest") filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    if (sortBy === "Oldest") filtered.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
    if (sortBy === "Most Liked") filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    setFilteredPosts(filtered);
  }, [
    searchQuery,
    selectedLocations,
    dateFilter,
    availableRange,
    sortBy,
    minPayout,
    maxPayout,
    minLoadLength,
    maxLoadLength,
    minLoadWeight,
    maxLoadWeight,
    selectedTruckTypes,
    selectedPickupCities,
    selectedDropoffCities,
    allPosts,
    setFilteredPosts,
  ]);

  if (!show) return null;

  return (
    <div className="l-filter-overlay">
      <div className="l-filter-sheet">
        <div className="l-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="l-filter-sheet-body">
          {/* Post Locations */}
          <div className="l-filter-group">
            <label>Post Locations</label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/* Date Posted */}
          <div className="l-filter-group">
            <label>Date Posted</label>
            <select
              className="l-select"
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

          {/* Available Date */}
          <div className="l-filter-group">
            <label>Available Date</label>
            <button className="l-date-btn" onClick={() => setShowCalendar(true)}>
              Select Date Range
            </button>
            {availableRange?.from && (
              <div className="l-date-selected">
                <span>
                  {availableRange.from.toLocaleDateString()}
                  {availableRange.to ? ` - ${availableRange.to.toLocaleDateString()}` : ""}
                </span>
                <button onClick={() => setAvailableRange(undefined)}>✕</button>
              </div>
            )}
          </div>

          {/* Payout */}
          <div className="l-filter-group">
            <label>Payout ($)</label>
            <div className="l-price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPayout}
                onChange={(e) => setMaxPayout(e.target.value)}
              />
            </div>
          </div>

          {/* Load Length */}
          <div className="l-filter-group">
            <label>Load Length (ft)</label>
            <div className="l-price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minLoadLength}
                onChange={(e) => setMinLoadLength(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxLoadLength}
                onChange={(e) => setMaxLoadLength(e.target.value)}
              />
            </div>
          </div>

          {/* Load Weight */}
          <div className="l-filter-group">
            <label>Load Weight (lb)</label>
            <div className="l-price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minLoadWeight}
                onChange={(e) => setMinLoadWeight(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxLoadWeight}
                onChange={(e) => setMaxLoadWeight(e.target.value)}
              />
            </div>
          </div>

          {/* Truck Type */}
          <div className="l-filter-group">
            <label>Required Truck Type</label>
            <div className="l-options">
              <label>
                <input
                  type="checkbox"
                  checked={selectedTruckTypes.length === 0}
                  onChange={() => setSelectedTruckTypes([])}
                />
                Show All
              </label>
              {availableTruckTypes.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    checked={selectedTruckTypes.includes(type)}
                    onChange={() =>
                      setSelectedTruckTypes((prev) =>
                        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                      )
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Pickup City */}
          <div className="l-filter-group">
            <label>Pickup City</label>
            <div className="l-options">
              <label>
                <input
                  type="checkbox"
                  checked={selectedPickupCities.length === 0}
                  onChange={() => setSelectedPickupCities([])}
                />
                Show All
              </label>
              {availablePickupCities.map((city) => (
                <label key={city}>
                  <input
                    type="checkbox"
                    checked={selectedPickupCities.includes(city)}
                    onChange={() =>
                      setSelectedPickupCities((prev) =>
                        prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
                      )
                    }
                  />
                  {city}
                </label>
              ))}
            </div>
          </div>

          {/* Drop-Off City */}
          <div className="l-filter-group">
            <label>Drop-Off City</label>
            <div className="l-options">
              <label>
                <input
                  type="checkbox"
                  checked={selectedDropoffCities.length === 0}
                  onChange={() => setSelectedDropoffCities([])}
                />
                Show All
              </label>
              {availableDropoffCities.map((city) => (
                <label key={city}>
                  <input
                    type="checkbox"
                    checked={selectedDropoffCities.includes(city)}
                    onChange={() =>
                      setSelectedDropoffCities((prev) =>
                        prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
                      )
                    }
                  />
                  {city}
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="l-filter-group">
            <label>Sort By</label>
            <select
              className="l-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Show All</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>

          <button className="l-apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>

      {showCalendar && (
        <CalendarDateRangeOverlay
          range={availableRange}
          setRange={setAvailableRange}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

export default FilterPanelMobile;