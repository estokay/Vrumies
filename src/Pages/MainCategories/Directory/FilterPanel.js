import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../../Components/Css/MainFilterPanel.css';
import PostLocationMultiSelect from '../../../Components/FiltersMobile/PostLocationMultiSelect';

const FilterPanel = ({ searchQuery = '', onFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [serviceLocation, setServiceLocation] = useState('Show All');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const parsePrice = (price) => {
    if (typeof price === 'number') return price; // already a number
    if (typeof price === 'string') {
      const num = Number(price.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? null : num;
    }
    return null;
  };

  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    service: true,
    price: true,
    date: true,
    sort: true,
  });

  // 🔹 Fetch directory posts + extract locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'directory'));
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

    // Service location
    if (serviceLocation !== 'Show All') {
      filtered = filtered.filter(
        p => p.serviceLocation === serviceLocation
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
    serviceLocation,
    selectedLocations,
    dateFilter,
    sortBy,
    minPrice,
    maxPrice,
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
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
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
            <select
              className="filterpanel-select"
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
        )}
      </div>

      {/* SERVICE LOCATION */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('service')}>
          Service Location <span>{sectionsOpen.service ? '−' : '+'}</span>
        </div>
        {sectionsOpen.service && (
          <div className="filterpanel-options">
            {['Show All', 'Customer Address', 'Business Address'].map(opt => (
              <label key={opt} className="filterpanel-option">
                <input
                  type="radio"
                  checked={serviceLocation === opt}
                  onChange={() => setServiceLocation(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('price')}>
          Price ($) <span>{sectionsOpen.price ? '−' : '+'}</span>
        </div>

        {sectionsOpen.price && (
        <div className="filterpanel-options">
          <div className="filterpanel-price-inline">
            <span className="filterpanel-price-label"></span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <span className="filterpanel-price-separator">–</span>

            <span className="filterpanel-price-label"></span>
            <input
              type="number"
              className="filterpanel-input"
              placeholder="Max"
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
            <select
              className="filterpanel-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Show All</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>
        )}
      </div>

    </div>
  );
};

export default FilterPanel;
