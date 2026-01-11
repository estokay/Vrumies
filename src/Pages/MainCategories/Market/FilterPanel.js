import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../../Components/Css/MainFilterPanel.css';

const FilterPanel = ({ searchQuery = '', onFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [conditionFilter, setConditionFilter] = useState('Show All');

  const [availableShippingTimes, setAvailableShippingTimes] = useState([]);
  const [selectedShippingTimes, setSelectedShippingTimes] = useState([]);

  const parsePrice = (price) => {
  if (typeof price !== 'string') return null;

  const num = Number(price.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : num;
};

  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    date: true,
    sort: true,
    condition: true,
    shipping: true,
    price: true,
  });

  // 🔹 Fetch directory posts + extract locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'market'));
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

      const shippingTimes = Array.from(
      new Set(posts.map(p => p.shippingTime).filter(Boolean))
      );

      setAvailableShippingTimes(shippingTimes);

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

    

    // Price filter
    if (minPrice !== '') {
      filtered = filtered.filter(p => {
        const priceNum = parsePrice(p.price);
        return priceNum !== null && priceNum >= Number(minPrice);
      });
    }

    if (maxPrice !== '') {
      filtered = filtered.filter(p => {
        const priceNum = parsePrice(p.price);
        return priceNum !== null && priceNum <= Number(maxPrice);
      });
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

    // Condition filter
    if (conditionFilter !== 'Show All') {
    filtered = filtered.filter(
      p => p.condition === conditionFilter
    );
    }

    // Shipping Time filter (Show All = none selected)
    if (selectedShippingTimes.length > 0) {
      filtered = filtered.filter(p =>
        selectedShippingTimes.includes(p.shippingTime)
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
    sortBy,
    minPrice,
    maxPrice,
    allPosts,
    onFilteredPosts,
    conditionFilter,
    selectedShippingTimes,
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

      {/* CONDITION */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection('condition')}
        >
          Condition <span>{sectionsOpen.condition ? '−' : '+'}</span>
        </div>

        {sectionsOpen.condition && (
          <div className="filterpanel-options">
            {['Show All', 'New', 'Used'].map(opt => (
              <label key={opt} className="filterpanel-option">
                <input
                  type="radio"
                  checked={conditionFilter === opt}
                  onChange={() => setConditionFilter(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>

    {/* SHIPPING TIME */}
    <div className="filterpanel-section">
      <div
        className="filterpanel-header"
        onClick={() => toggleSection('shipping')}
      >
        Shipping Time <span>{sectionsOpen.shipping ? '−' : '+'}</span>
      </div>

      {sectionsOpen.shipping && (
        <div className="filterpanel-options">

          {/* SHOW ALL */}
          <label className="filterpanel-option">
            <input
              type="checkbox"
              checked={selectedShippingTimes.length === 0}
              onChange={() => setSelectedShippingTimes([])}
            />
            Show All
          </label>

          {/* FIRESTORE SHIPPING TIMES */}
          {availableShippingTimes.map(time => (
            <label key={time} className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedShippingTimes.includes(time)}
                onChange={() =>
                  setSelectedShippingTimes(prev =>
                    prev.includes(time)
                      ? prev.filter(t => t !== time)
                      : [...prev, time]
                  )
                }
              />
              {time}
            </label>
          ))}
        </div>
      )}
    </div>

      {/* PRICE */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('price')}>
          Price <span>{sectionsOpen.price ? '−' : '+'}</span>
        </div>

        {sectionsOpen.price && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label">Min ($)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <span className="filterpanel-price-separator">–</span>

            <span className="filterpanel-price-label">Max ($)</span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
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

    </div>
  );
};

export default FilterPanel;
