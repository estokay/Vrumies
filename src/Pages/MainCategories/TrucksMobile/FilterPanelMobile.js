import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CalendarDateRangeOverlay from "../../../Components/Overlays/CalendarDateRangeOverlay";
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
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTruckTypes, setSelectedTruckTypes] = useState([]);
  const [selectedOriginCities, setSelectedOriginCities] = useState([]);
  const [selectedDestinationCities, setSelectedDestinationCities] = useState([]);
  const [minLoadWeight, setMinLoadWeight] = useState("");
  const [minLoadLength, setMinLoadLength] = useState("");
  const [minPerMileRate, setMinPerMileRate] = useState("");
  const [maxPerMileRate, setMaxPerMileRate] = useState("");
  const [dateFilter, setDateFilter] = useState("Show All");
  const [availableRange, setAvailableRange] = useState();
  const [sortBy, setSortBy] = useState("Show All");

  // Options
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTruckTypes, setAvailableTruckTypes] = useState([]);
  const [availableOriginCities, setAvailableOriginCities] = useState([]);
  const [availableDestinationCities, setAvailableDestinationCities] = useState([]);

  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "trucks"));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPostsLocal(posts);
      setAllPosts(posts);

      // Extract unique filter options
      setAvailableLocations(Array.from(new Set(posts.map(p => p.location).filter(Boolean))));
      setAvailableTruckTypes(Array.from(new Set(posts.map(p => p.truckType).filter(Boolean))));
      setAvailableOriginCities(Array.from(new Set(posts.flatMap(p => p.originCities || []))));
      setAvailableDestinationCities(Array.from(new Set(posts.flatMap(p => p.destinationCities || []))));
    };

    fetchPosts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...allPostsLocal];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }

    // Filters
    if (selectedLocations.length) result = result.filter(p => selectedLocations.includes(p.location));
    if (selectedTruckTypes.length) result = result.filter(p => selectedTruckTypes.includes(p.truckType));
    if (selectedOriginCities.length) result = result.filter(p => p.originCities?.some(c => selectedOriginCities.includes(c)));
    if (selectedDestinationCities.length) result = result.filter(p => p.destinationCities?.some(c => selectedDestinationCities.includes(c)));
    if (minLoadWeight) result = result.filter(p => p.loadWeight >= Number(minLoadWeight));
    if (minLoadLength) result = result.filter(p => p.loadLengthMax >= Number(minLoadLength));
    if (minPerMileRate !== "" || maxPerMileRate !== "") {
      result = result.filter(p => {
        if (typeof p.minPerMile !== "number") return false;

        const rate = p.minPerMile;

        if (minPerMileRate !== "" && rate < Number(minPerMileRate)) {
          return false;
        }

        if (maxPerMileRate !== "" && rate > Number(maxPerMileRate)) {
          return false;
        }

        return true;
      });
    }

    // Date Posted filter
    if (dateFilter !== "Show All") {
      const now = new Date();
      result = result.filter(p => {
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

    // Available date
    if (availableRange?.from) {
      result = result.filter(p => {
        if (!p.availableDate?.toDate) return false;
        const available = p.availableDate.toDate();
        if (!availableRange.to) return available.toDateString() === availableRange.from.toDateString();
        return available >= availableRange.from && available <= availableRange.to;
      });
    }

    // Sort
    if (sortBy === "Newest") result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (sortBy === "Oldest") result.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    if (sortBy === "Most Liked") result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    setFilteredPosts(result);
  }, [
    searchQuery,
    selectedLocations,
    selectedTruckTypes,
    selectedOriginCities,
    selectedDestinationCities,
    minLoadWeight,
    minLoadLength,
    minPerMileRate,
    maxPerMileRate,
    dateFilter,
    availableRange,
    sortBy,
    allPostsLocal,
    setFilteredPosts
  ]);

  if (!show) return null;

  return (
    <div className="t-filter-overlay">
      <div className="t-filter-sheet">
        <div className="t-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="t-filter-sheet-body">
          {/* Post Locations */}
          <div className="t-filter-group">
            <label>Post Locations</label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/* Truck Types */}
          <div className="t-filter-group">
            <label>Truck Types</label>
            <div className="t-chip-group">
              <div className={`t-chip ${selectedTruckTypes.length === 0 ? "active" : ""}`} onClick={() => setSelectedTruckTypes([])}>Show All</div>
              {availableTruckTypes.map(truck => (
                <div
                  key={truck}
                  className={`t-chip ${selectedTruckTypes.includes(truck) ? "active" : ""}`}
                  onClick={() =>
                    setSelectedTruckTypes(prev => prev.includes(truck) ? prev.filter(x => x !== truck) : [...prev, truck])
                  }
                >
                  {truck}
                </div>
              ))}
            </div>
          </div>

          {/* Origin Cities */}
          <div className="t-filter-group">
            <label>Origin Cities</label>
            <div className="t-chip-group">
              <div className={`t-chip ${selectedOriginCities.length === 0 ? "active" : ""}`} onClick={() => setSelectedOriginCities([])}>Show All</div>
              {availableOriginCities.map(city => (
                <div
                  key={city}
                  className={`t-chip ${selectedOriginCities.includes(city) ? "active" : ""}`}
                  onClick={() =>
                    setSelectedOriginCities(prev => prev.includes(city) ? prev.filter(x => x !== city) : [...prev, city])
                  }
                >
                  {city}
                </div>
              ))}
            </div>
          </div>

          {/* Destination Cities */}
          <div className="t-filter-group">
            <label>Destination Cities</label>
            <div className="t-chip-group">
              <div className={`t-chip ${selectedDestinationCities.length === 0 ? "active" : ""}`} onClick={() => setSelectedDestinationCities([])}>Show All</div>
              {availableDestinationCities.map(city => (
                <div
                  key={city}
                  className={`t-chip ${selectedDestinationCities.includes(city) ? "active" : ""}`}
                  onClick={() =>
                    setSelectedDestinationCities(prev => prev.includes(city) ? prev.filter(x => x !== city) : [...prev, city])
                  }
                >
                  {city}
                </div>
              ))}
            </div>
          </div>

          {/* Numeric filters */}
          <div className="t-filter-group">
            <label>Load Weight (lbs)</label>
            <input type="number" placeholder="Min" value={minLoadWeight} onChange={e => setMinLoadWeight(e.target.value)} />
          </div>

          <div className="t-filter-group">
            <label>Load Length (ft)</label>
            <input type="number" placeholder="Min" value={minLoadLength} onChange={e => setMinLoadLength(e.target.value)} />
          </div>

          <div className="t-filter-group">
            <label>Rate Per Mile ($)</label>

            <div className="t-range-row">
              <input
                type="number"
                step="0.01"
                placeholder="Min"
                value={minPerMileRate}
                onChange={e => setMinPerMileRate(e.target.value)}
              />

              <span className="t-range-separator">-</span>

              <input
                type="number"
                step="0.01"
                placeholder="Max"
                value={maxPerMileRate}
                onChange={e => setMaxPerMileRate(e.target.value)}
              />
            </div>
          </div>

          {/* Date Posted */}
          <div className="t-filter-group">
            <label>Date Posted</label>
            <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
              {["Show All", "Today", "This Week", "This Month", "Last Three Months"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Available Date */}
          <div className="t-filter-group">
            <label>Available Date</label>
            <button className="t-date-btn" onClick={() => setShowCalendar(true)}>📅 Select Date Range</button>
            {availableRange?.from && (
              <div className="t-date-selected">
                {availableRange.from.toLocaleDateString()}
                {availableRange.to ? ` - ${availableRange.to.toLocaleDateString()}` : ""}
                <button onClick={() => setAvailableRange(undefined)}>✕</button>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="t-filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {["Show All", "Newest", "Oldest", "Most Liked"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <button className="t-apply-btn" onClick={onClose}>Apply Filters</button>
        </div>

        {showCalendar && (
          <CalendarDateRangeOverlay
            range={availableRange}
            setRange={setAvailableRange}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </div>
    </div>
  );
};

export default FilterPanelMobile;