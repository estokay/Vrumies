import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../../Components/Css/MainFilterPanel.css';
import CalendarDateRangeOverlay from "../../../Components/Overlays/CalendarDateRangeOverlay";

const FilterPanel = ({ searchQuery = '', onFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');

  const [availableTruckTypes, setAvailableTruckTypes] = useState([]);
  const [selectedTruckTypes, setSelectedTruckTypes] = useState([]);

  const [availableOriginCities, setAvailableOriginCities] = useState([]);
  const [selectedOriginCities, setSelectedOriginCities] = useState([]);

  const [availableDestinationCities, setAvailableDestinationCities] = useState([]);
  const [selectedDestinationCities, setSelectedDestinationCities] = useState([]);

  const [minLoadWeight, setMinLoadWeight] = useState('');
  const [minLoadLength, setMinLoadLength] = useState('');

  const [maxPerMileRate, setMaxPerMileRate] = useState('');

  const [availableRange, setAvailableRange] = useState();
  const [showCalendar, setShowCalendar] = useState(false);

  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    date: true,
    availableDate: true,
    sort: true,
    truckType: true,
    originCities: true,
    destinationCities: true,
    loadWeight: true,
    loadLength: true,
    minPerMile: true,
  });

  // 🔹 Fetch directory posts + extract locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'trucks'));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllPosts(posts);

      // 🔹 Get unique locations from Firestore posts
      const locations = Array.from(
        new Set(posts.map(p => p.location).filter(Boolean))
      );

      setAvailableLocations(locations);

      // 🔹 Get unique truck types
      const truckTypes = Array.from(
        new Set(posts.map(p => p.truckType).filter(Boolean))
      );

      setAvailableTruckTypes(truckTypes);

      // 🔹 Extract unique origin city strings from posts
      const originCities = Array.from(
        new Set(
          posts.flatMap(p => p.originCities || []) // just use the string array
        )
      );

      setAvailableOriginCities(originCities);

      const destinationCities = Array.from(
        new Set(
          posts.flatMap(p => p.destinationCities || [])
        )
      );

      setAvailableDestinationCities(destinationCities);
      
    };

    fetchPosts();
  }, []);

  // 🔹 Apply filters + sorting
  useEffect(() => {
    let filtered = [...allPosts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        (post.title || '').toLowerCase().includes(q) ||
        (post.description || '').toLowerCase().includes(q)
      );
    }

    // Post Locations (Show All = none selected)
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(p =>
        selectedLocations.includes(p.location)
      );
    }

    // Load Weight filter (AT LEAST)
    if (minLoadWeight !== '') {
      filtered = filtered.filter(
        p =>
          typeof p.loadWeight === 'number' &&
          p.loadWeight >= Number(minLoadWeight)
      );
    }

    // Load Length Max Limit
    if (minLoadLength !== '') {
      filtered = filtered.filter(p =>
        typeof p.loadLengthMax === 'number' &&
        p.loadLengthMax >= Number(minLoadLength)
      );
    }

    // Date filter
    if (dateFilter !== 'Show All') {
      const now = new Date();
      filtered = filtered.filter(p => {
        const postDate = new Date(p.createdAt?.seconds * 1000);
        if (dateFilter === 'Today') {
          return postDate.toDateString() === now.toDateString();
        }
        if (dateFilter === 'This Week') {
          return now - postDate <= 7 * 86400000;
        }
        if (dateFilter === 'This Month') {
          return (
            postDate.getMonth() === now.getMonth() &&
            postDate.getFullYear() === now.getFullYear()
          );
        }
        if (dateFilter === 'Last Three Months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return postDate >= threeMonthsAgo && postDate <= now;
        }
        return true;
      });
    }

    // Available Date filter
    if (availableRange?.from) {
      filtered = filtered.filter((post) => {
        if (!post.availableDate || typeof post.availableDate.toDate !== 'function') return false;

        const available = post.availableDate.toDate();

        if (!availableRange.to) {
          return available.toDateString() === availableRange.from.toDateString();
        }

        return available >= availableRange.from && available <= availableRange.to;
      });
    }

    // Truck Type filter (Show All = none selected)
    if (selectedTruckTypes.length > 0) {
      filtered = filtered.filter(p =>
        selectedTruckTypes.includes(p.truckType)
      );
    }

    // Origin Cities filter (Show All = none selected)
    if (selectedOriginCities.length > 0) {
      filtered = filtered.filter(p =>
        p.originCities?.some(city =>
          selectedOriginCities.includes(city)
        )
      );
    }

    // Destination Cities filter (Show All = none selected)
    if (selectedDestinationCities.length > 0) {
      filtered = filtered.filter(p =>
        p.destinationCities?.some(city =>
          selectedDestinationCities.includes(city)
        )
      );
    }

    // Minimum Per Mile Rate filter (AT OR BELOW)
    if (maxPerMileRate !== '') {
      filtered = filtered.filter(
        p =>
          typeof p.minPerMile === 'number' &&
          p.minPerMile <= Number(maxPerMileRate)
      );
    }

    // Sorting
    if (sortBy === 'Newest') {
      filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    }
    if (sortBy === 'Oldest') {
      filtered.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
    }
    if (sortBy === 'Most Liked') {
    filtered.sort(
    (a, b) =>
      (b.likes?.length || 0) - (a.likes?.length || 0)
    );
}

    onFilteredPosts(filtered);
  }, [
    searchQuery,
    selectedLocations,
    dateFilter,
    availableRange,
    sortBy,
    selectedTruckTypes,
    selectedOriginCities,
    selectedDestinationCities,
    minLoadWeight,
    minLoadLength,
    maxPerMileRate,
    allPosts,
    onFilteredPosts,
  ]);

  const toggleSection = (key) => {
    setSectionsOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="filterpanel">

      {/* POST LOCATIONS */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('location')}>
          Post Locations <span>{sectionsOpen.location ? '−' : '+'}</span>
        </div>

        {sectionsOpen.location && (
          <div className="filterpanel-options">

            {/* SHOW ALL */}
            <label className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedLocations.length === 0}
                onChange={() => setSelectedLocations([])}
              />
              Show All
            </label>

            {/* FIRESTORE LOCATIONS */}
            {availableLocations.map(loc => (
              <label key={loc} className="filterpanel-option">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(loc)}
                  onChange={() =>
                    setSelectedLocations(prev =>
                      prev.includes(loc)
                        ? prev.filter(l => l !== loc)
                        : [...prev, loc]
                    )
                  }
                />
                {loc}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* DATE */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('date')}>
          Date Posted <span>{sectionsOpen.date ? '−' : '+'}</span>
        </div>
        {sectionsOpen.date && (
          <div className="filterpanel-options">
            {['Show All', 'Today', 'This Week', 'This Month', 'Last Three Months'].map(opt => (
              <label key={opt} className="filterpanel-option">
                <input
                  type="radio"
                  checked={dateFilter === opt}
                  onChange={() => setDateFilter(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* AVAILABLE DATE */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection('availableDate')}
        >
          Available Date <span>{sectionsOpen.availableDate ? '−' : '+'}</span>
        </div>

        {sectionsOpen.availableDate && (
          <div className="filterpanel-options">
            <div className="filterpanel-date-controls">
              <button
                className="filterpanel-date-btn"
                onClick={() => setShowCalendar(true)}
              >
                📅 Select Date Range
              </button>

              {availableRange?.from && (
                <div className="filterpanel-date-selected">
                  <span>
                    {availableRange.from.toLocaleDateString()}
                    {availableRange.to
                      ? ` - ${availableRange.to.toLocaleDateString()}`
                      : ''}
                  </span>

                  <button
                    className="filterpanel-clear-btn"
                    onClick={() => setAvailableRange(undefined)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TRUCK TYPE */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('truckType')}>
          Truck Type <span>{sectionsOpen.truckType ? '−' : '+'}</span>
        </div>

        {sectionsOpen.truckType && (
        <div className="filterpanel-options">

          {/* SHOW ALL */}
          <label className="filterpanel-option">
            <input
              type="checkbox"
              checked={selectedTruckTypes.length === 0}
              onChange={() => setSelectedTruckTypes([])}
            />
            Show All
          </label>

          {/* FIRESTORE TRUCK TYPES */}
          {availableTruckTypes.map(type => (
            <label key={type} className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedTruckTypes.includes(type)}
                onChange={() =>
                  setSelectedTruckTypes(prev =>
                    prev.includes(type)
                      ? prev.filter(t => t !== type)
                      : [...prev, type]
                  )
                }
              />
              {type}
            </label>
          ))}
        </div>
        )}
      </div>

      {/* Origin Cities */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('originCities')}>
          Origin (Start City) <span>{sectionsOpen.originCities ? '−' : '+'}</span>
        </div>

        {sectionsOpen.originCities && (
        <div className="filterpanel-options">
          {/* SHOW ALL */}
          <label className="filterpanel-option">
            <input
              type="checkbox"
              checked={selectedOriginCities.length === 0}
              onChange={() => setSelectedOriginCities([])}
            />
            Show All
          </label>

          {/* FIRESTORE ORIGIN CITIES */}
          {availableOriginCities.map(city => (
            <label key={city} className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedOriginCities.includes(city)}
                onChange={() =>
                  setSelectedOriginCities(prev =>
                    prev.includes(city)
                      ? prev.filter(c => c !== city)
                      : [...prev, city]
                  )
                }
              />
              {city}
            </label>
          ))}
        </div>
        )}
      </div>

      {/* Destination Cities */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('destinationCities')}>
          Destination (End City) <span>{sectionsOpen.destinationCities ? '−' : '+'}</span>
        </div>

        {sectionsOpen.destinationCities && (
        <div className="filterpanel-options">
          {/* SHOW ALL */}
          <label className="filterpanel-option">
            <input
              type="checkbox"
              checked={selectedDestinationCities.length === 0}
              onChange={() => setSelectedDestinationCities([])}
            />
            Show All
          </label>

          {/* FIRESTORE DESTINATION CITIES */}
          {availableDestinationCities.map(city => (
            <label key={city} className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedDestinationCities.includes(city)}
                onChange={() =>
                  setSelectedDestinationCities(prev =>
                    prev.includes(city)
                      ? prev.filter(c => c !== city)
                      : [...prev, city]
                  )
                }
              />
              {city}
            </label>
          ))}
        </div>
        )}
      </div>
    
      {/* LOAD WEIGHT */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('loadWeight')}>
          Load Weight Max Limit <span>{sectionsOpen.loadWeight ? '−' : '+'}</span>
        </div>

        {sectionsOpen.loadWeight && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label">At least</span>

            <input
              type="number"
              className="filterpanel-input"
              placeholder="0"
              value={minLoadWeight}
              onChange={(e) => setMinLoadWeight(e.target.value)}
            />

            <span className="filterpanel-price-label">lbs</span>
          </div>
        </div>
        )}
      </div>

      {/* LOAD LENGTH */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('loadLength')}>
          Load Length Max Limit <span>{sectionsOpen.loadLength ? '−' : '+'}</span>
        </div>

        {sectionsOpen.loadLength && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label">At least</span>

            <input
              type="number"
              className="filterpanel-input"
              placeholder="0"
              value={minLoadLength}
              onChange={(e) => setMinLoadLength(e.target.value)}
            />

            <span className="filterpanel-price-label">ft</span>
          </div>
        </div>
        )}
      </div>

      {/* MINIMUM PER MILE RATE */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('minPerMile')}>
          Minimum Per Mile Rate <span>{sectionsOpen.minPerMile ? '−' : '+'}</span>
        </div>

        {sectionsOpen.minPerMile && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label">At or below ($)</span>

            <input
              type="number"
              step="0.01"
              className="filterpanel-input"
              placeholder="e.g. 2.50"
              value={maxPerMileRate}
              onChange={(e) => setMaxPerMileRate(e.target.value)}
            />

            <span className="filterpanel-price-label">per mile</span>
          </div>
        </div>
        )}
      </div>

      {/* SORT */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('sort')}>
          Sort By <span>{sectionsOpen.sort ? '−' : '+'}</span>
        </div>
        {sectionsOpen.sort && (
          <div className="filterpanel-options">
            {['Show All', 'Newest', 'Oldest', 'Most Liked'].map(opt => (
              <label key={opt} className="filterpanel-option">
                <input
                  type="radio"
                  checked={sortBy === opt}
                  onChange={() => setSortBy(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
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

export default FilterPanel;
