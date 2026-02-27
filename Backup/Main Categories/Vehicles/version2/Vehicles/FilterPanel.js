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

  const [sellerType, setSellerType] = useState('Show All');

  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');

  const [availableMakes, setAvailableMakes] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);

  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const parsePrice = (price) => {
  if (typeof price !== 'string') return null;

  const num = Number(price.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : num;
};

  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    date: true,
    sort: true,
    sellerType: true,
    year: true,
    make: true,
    model: true,
    price: true,
  });

  // 🔹 Fetch directory posts + extract locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'vehicle'));
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

      

      // 🔹 Get unique makes from Firestore posts
      const makes = Array.from(
        new Set(
          posts
            .map(p => p.make)
            .filter(m => typeof m === 'string' && m.trim() !== '')
        )
      );

      setAvailableMakes(makes);

      // 🔹 Get unique models from Firestore posts
      const models = Array.from(
        new Set(
          posts
            .map(p => p.model)
            .filter(m => typeof m === 'string' && m.trim() !== '')
        )
      );

      setAvailableModels(models);

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

    // Seller Type filter
    if (sellerType !== 'Show All') {
      filtered = filtered.filter(
        p => p.sellerType === sellerType
      );
    }

    // Vehicle Year filter
    if (minYear !== '') {
      filtered = filtered.filter(
        p => typeof p.year === 'number' && p.year >= Number(minYear)
      );
    }

    if (maxYear !== '') {
      filtered = filtered.filter(
        p => typeof p.year === 'number' && p.year <= Number(maxYear)
      );
    }

    // Make filter (Show All = none selected)
    if (selectedMakes.length > 0) {
      filtered = filtered.filter(p =>
        selectedMakes.includes(p.make)
      );
    }

    // Model filter (Show All = none selected)
    if (selectedModels.length > 0) {
      filtered = filtered.filter(p =>
        selectedModels.includes(p.model)
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
    selectedLocations,
    dateFilter,
    sortBy,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    selectedMakes,
    selectedModels,
    allPosts,
    onFilteredPosts,
    sellerType,
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

      {/* SELLER TYPE */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection('sellerType')}
        >
          Seller Type <span>{sectionsOpen.sellerType ? '−' : '+'}</span>
        </div>

        {sectionsOpen.sellerType && (
          <div className="filterpanel-options">

            <label className="filterpanel-option">
              <input
                type="radio"
                checked={sellerType === 'Show All'}
                onChange={() => setSellerType('Show All')}
              />
              Show All
            </label>

            <label className="filterpanel-option">
              <input
                type="radio"
                checked={sellerType === 'owner'}
                onChange={() => setSellerType('owner')}
              />
              Owner
            </label>

            <label className="filterpanel-option">
              <input
                type="radio"
                checked={sellerType === 'dealer'}
                onChange={() => setSellerType('dealer')}
              />
              Dealer
            </label>

          </div>
        )}
      </div>

      {/* VEHICLE YEAR */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection('year')}
        >
          Vehicle Year <span>{sectionsOpen.year ? '−' : '+'}</span>
        </div>

        {sectionsOpen.year && (
          <div className="filterpanel-options">
            <div className="filterpanel-price-inline">
              <span className="filterpanel-price-label">Min</span>
              <input
                type="number"
                className="filterpanel-input"
                placeholder="Any"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
              />

              <span className="filterpanel-price-separator">–</span>

              <span className="filterpanel-price-label">Max</span>
              <input
                type="number"
                className="filterpanel-input"
                placeholder="Any"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* MAKE */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection('make')}
        >
          Make <span>{sectionsOpen.make ? '−' : '+'}</span>
        </div>

        {sectionsOpen.make && (
          <div className="filterpanel-options">

            {/* SHOW ALL */}
            <label className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedMakes.length === 0}
                onChange={() => setSelectedMakes([])}
              />
              Show All
            </label>

            {/* FIRESTORE MAKES */}
            {availableMakes.map(make => (
              <label key={make} className="filterpanel-option">
                <input
                  type="checkbox"
                  checked={selectedMakes.includes(make)}
                  onChange={() =>
                    setSelectedMakes(prev =>
                      prev.includes(make)
                        ? prev.filter(m => m !== make)
                        : [...prev, make]
                    )
                  }
                />
                {make}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* MODEL */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection('model')}
        >
          Model <span>{sectionsOpen.model ? '−' : '+'}</span>
        </div>

        {sectionsOpen.model && (
          <div className="filterpanel-options">

            {/* SHOW ALL */}
            <label className="filterpanel-option">
              <input
                type="checkbox"
                checked={selectedModels.length === 0}
                onChange={() => setSelectedModels([])}
              />
              Show All
            </label>

            {/* FIRESTORE MODELS */}
            {availableModels.map(model => (
              <label key={model} className="filterpanel-option">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model)}
                  onChange={() =>
                    setSelectedModels(prev =>
                      prev.includes(model)
                        ? prev.filter(m => m !== model)
                        : [...prev, model]
                    )
                  }
                />
                {model}
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
