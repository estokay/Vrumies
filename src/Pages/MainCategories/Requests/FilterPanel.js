import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../../Components/Css/MainFilterPanel.css';
import PostLocationMultiSelect from '../../../Components/FiltersMobile/PostLocationMultiSelect';

const FilterPanel = ({ searchQuery = '', onFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');
  const [availableUrgencies, setAvailableUrgencies] = useState([]);
  const [selectedUrgencies, setSelectedUrgencies] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const parsePrice = (price) => {
    if (price === undefined || price === null) return null;

    if (typeof price === 'number') return price;

    if (typeof price === 'string') {
      const num = Number(price.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? null : num;
    }

    return null;
  };

  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    date: true,
    sort: true,
    urgency: true,
    price: true,
  });

  // 🔹 Fetch directory posts + extract locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'request'));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllPosts(posts);

      const urgencies = Array.from(
        new Set(
          posts
            .map(p => p.urgency)
            .filter(u => typeof u === 'string' && u.trim() !== '')
        )
      );

      setAvailableUrgencies(urgencies);

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

    

    // Post Locations (Show All = none selected)
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(p =>
        selectedLocations.includes(p.location)
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

    

    // Urgency filter (Show All = none selected)
    if (selectedUrgencies.length > 0) {
      filtered = filtered.filter(p =>
        selectedUrgencies.includes(p.urgency)
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
    allPosts,
    onFilteredPosts,
    selectedUrgencies,
    minPrice,
    maxPrice,
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

      

      {/* URGENCY */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection('urgency')}
        >
          Urgency <span>{sectionsOpen.urgency ? '−' : '+'}</span>
        </div>

        {sectionsOpen.urgency && (
          <div className="filterpanel-options">

            {/* SHOW ALL */}
            <label className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedUrgencies.length === 0}
                onChange={() => setSelectedUrgencies([])}
              />
              Show All
            </label>

            {/* DYNAMIC URGENCY OPTIONS */}
            {availableUrgencies.map(urgency => (
              <label key={urgency} className="filterpanel-option">
                <input
                  type="checkbox"
                  checked={selectedUrgencies.includes(urgency)}
                  onChange={() =>
                    setSelectedUrgencies(prev =>
                      prev.includes(urgency)
                        ? prev.filter(u => u !== urgency)
                        : [...prev, urgency]
                    )
                  }
                />
                {urgency}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="filterpanel-section">
        <div className="filterpanel-header" onClick={() => toggleSection('price')}>
          Willing to Pay ($) <span>{sectionsOpen.price ? '−' : '+'}</span>
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
