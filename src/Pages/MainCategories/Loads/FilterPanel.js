import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../../Components/Css/MainFilterPanel.css';
import CalendarDateRangeOverlay from '../../../Components/Overlays/CalendarDateRangeOverlay';

const FilterPanel = ({ searchQuery = '', onFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');

  const [minPayout, setMinPayout] = useState('');
  const [maxPayout, setMaxPayout] = useState('');

  const [minLoadLength, setMinLoadLength] = useState('');
  const [maxLoadLength, setMaxLoadLength] = useState('');

  const [minLoadWeight, setMinLoadWeight] = useState('');
  const [maxLoadWeight, setMaxLoadWeight] = useState('');

  const [availableTruckTypes, setAvailableTruckTypes] = useState([]);
  const [selectedTruckTypes, setSelectedTruckTypes] = useState([]);

  const [availablePickupCities, setAvailablePickupCities] = useState([]);
  const [selectedPickupCities, setSelectedPickupCities] = useState([]);

  const [availableDropoffCities, setAvailableDropoffCities] = useState([]);
  const [selectedDropoffCities, setSelectedDropoffCities] = useState([]);

  const [availableRange, setAvailableRange] = useState();
  const [showCalendar, setShowCalendar] = useState(false);

  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    date: true,
    availableDate: true,
    pickup: true,
    dropoff: true,
    payout: true,
    loadLength: true,
    loadWeight: true,
    truckType: true,
    sort: true,
  });

  // 🔹 Fetch directory posts + extract locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'loads'));
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

      // 🔹 Get unique pickup cities
      const pickupCities = Array.from(
        new Set(posts.map(p => p.pickupCity).filter(Boolean))
      );

      setAvailablePickupCities(pickupCities);

      // 🔹 Get unique drop-off cities
      const dropoffCities = Array.from(
        new Set(posts.map(p => p.dropoffCity).filter(Boolean))
      );

      setAvailableDropoffCities(dropoffCities);
      

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

    // Payout filter
    if (minPayout !== '') {
      filtered = filtered.filter(
        p => typeof p.payout === 'number' && p.payout >= Number(minPayout)
      );
    }

    if (maxPayout !== '') {
      filtered = filtered.filter(
        p => typeof p.payout === 'number' && p.payout <= Number(maxPayout)
      );
    }

    // Load Length filter (ft)
    if (minLoadLength !== '') {
      filtered = filtered.filter(
        p =>
          typeof p.loadLength === 'number' &&
          p.loadLength >= Number(minLoadLength)
      );
    }

    if (maxLoadLength !== '') {
      filtered = filtered.filter(
        p =>
          typeof p.loadLength === 'number' &&
          p.loadLength <= Number(maxLoadLength)
      );
    }

    // Load Weight filter (lbs)
    if (minLoadWeight !== '') {
      filtered = filtered.filter(
        p =>
          typeof p.loadWeight === 'number' &&
          p.loadWeight >= Number(minLoadWeight)
      );
    }

    if (maxLoadWeight !== '') {
      filtered = filtered.filter(
        p =>
          typeof p.loadWeight === 'number' &&
          p.loadWeight <= Number(maxLoadWeight)
      );
    }

    // Truck Type filter (Show All = none selected)
    if (selectedTruckTypes.length > 0) {
      filtered = filtered.filter(p =>
        selectedTruckTypes.includes(p.truckType)
      );
    }

    // Pickup City filter (Show All = none selected)
    if (selectedPickupCities.length > 0) {
      filtered = filtered.filter(p =>
        selectedPickupCities.includes(p.pickupCity)
      );
    }

    // Drop-Off City filter (Show All = none selected)
    if (selectedDropoffCities.length > 0) {
      filtered = filtered.filter(p =>
        selectedDropoffCities.includes(p.dropoffCity)
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

      {/* PICKUP CITY */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('pickup')}>
          Pickup City <span>{sectionsOpen.pickup ? '−' : '+'}</span>
        </div>
        {sectionsOpen.pickup && (
        <div className="filterpanel-options">

          {/* SHOW ALL */}
          <label className="filterpanel-option">
            <input
              type="checkbox"
              checked={selectedPickupCities.length === 0}
              onChange={() => setSelectedPickupCities([])}
            />
            Show All
          </label>

          {/* FIRESTORE PICKUP CITIES */}
          {availablePickupCities.map(city => (
            <label key={city} className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedPickupCities.includes(city)}
                onChange={() =>
                  setSelectedPickupCities(prev =>
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
    
      {/* DROP-OFF CITY */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('dropoff')}>
          Drop-Off City <span>{sectionsOpen.dropoff ? '−' : '+'}</span>
        </div>
        {sectionsOpen.dropoff && (
        <div className="filterpanel-options">

          {/* SHOW ALL */}
          <label className="filterpanel-option">
            <input
              type="checkbox"
              checked={selectedDropoffCities.length === 0}
              onChange={() => setSelectedDropoffCities([])}
            />
            Show All
          </label>

          {/* FIRESTORE DROP-OFF CITIES */}
          {availableDropoffCities.map(city => (
            <label key={city} className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedDropoffCities.includes(city)}
                onChange={() =>
                  setSelectedDropoffCities(prev =>
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

      {/* PAYOUT */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('payout')}>
          Payout <span>{sectionsOpen.payout ? '−' : '+'}</span>
        </div>
        {sectionsOpen.payout && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label">Min ($)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="0"
              value={minPayout}
              onChange={(e) => setMinPayout(e.target.value)}
            />

            <span className="filterpanel-price-separator">–</span>

            <span className="filterpanel-price-label">Max ($)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="Any"
              value={maxPayout}
              onChange={(e) => setMaxPayout(e.target.value)}
            />
          </div>
        </div>
        )}
      </div>

      {/* LOAD LENGTH */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('loadLength')}>
          Load Length <span>{sectionsOpen.loadLength ? '−' : '+'}</span>
        </div>
        {sectionsOpen.loadLength && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label">Min (ft)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="0"
              value={minLoadLength}
              onChange={(e) => setMinLoadLength(e.target.value)}
            />

            <span className="filterpanel-price-separator">–</span>

            <span className="filterpanel-price-label">Max (ft)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="Any"
              value={maxLoadLength}
              onChange={(e) => setMaxLoadLength(e.target.value)}
            />
          </div>
        </div>
        )}
      </div>

      {/* LOAD WEIGHT */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('loadWeight')}>
          Load Weight <span>{sectionsOpen.loadWeight ? '−' : '+'}</span>
        </div>
        {sectionsOpen.loadWeight && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label">Min (lb)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="0"
              value={minLoadWeight}
              onChange={(e) => setMinLoadWeight(e.target.value)}
            />

            <span className="filterpanel-price-separator">–</span>

            <span className="filterpanel-price-label">Max (lb)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="Any"
              value={maxLoadWeight}
              onChange={(e) => setMaxLoadWeight(e.target.value)}
            />
          </div>
        </div>
        )}
      </div>

      {/* TRUCK TYPE */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('truckType')}>
          Required Truck Type <span>{sectionsOpen.truckType ? '−' : '+'}</span>
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
