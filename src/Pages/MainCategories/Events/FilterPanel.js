import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../../Components/Css/MainFilterPanel.css';
import CalendarDateRangeOverlay from "../../../Components/Overlays/CalendarDateRangeOverlay";
import { format } from "date-fns";
import PostLocationMultiSelect from '../../../Components/FiltersMobile/PostLocationMultiSelect';

const FilterPanel = ({ searchQuery = '', onFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  const [showDateOverlay, setShowDateOverlay] = useState(false);

  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    date: true,
    eventDate: true,
    sort: true,
  });

  // 🔹 Fetch directory posts + extract locations
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, 'Posts');
      const q = query(ref, where('type', '==', 'event'));
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

    
    // Event Date Range Filter
    if (dateRange.from && dateRange.to) {
      const normalize = (d) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());

      const start = normalize(dateRange.from);
      const end = normalize(dateRange.to);

      filtered = filtered.filter(p => {
        if (!p.eventDateTime?.seconds) return false;

        const eventDate = normalize(
          new Date(p.eventDateTime.seconds * 1000)
        );

        return eventDate >= start && eventDate <= end;
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
    dateRange,
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

      {/* EVENT DATE RANGE */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection("eventDate")}
        >
          Event Date Range <span>{sectionsOpen.eventDate ? "−" : "+"}</span>
        </div>

        {sectionsOpen.eventDate && (
          <div className="filterpanel-options">
            <div className="filterpanel-date-controls">

              <button
                className="filterpanel-date-btn"
                onClick={() => setShowDateOverlay(true)}
              >
                📅 Select Date Range
              </button>

              {dateRange?.from && (
                <div className="filterpanel-date-selected">
                  <span>
                    {format(dateRange.from, "MM/dd/yyyy")}
                    {dateRange.to
                      ? ` - ${format(dateRange.to, "MM/dd/yyyy")}`
                      : ""}
                  </span>

                  <button
                    className="filterpanel-clear-btn"
                    onClick={() =>
                      setDateRange({ from: undefined, to: undefined })
                    }
                  >
                    ✕
                  </button>
                </div>
              )}

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
        )}
      </div>
      {/* Overlay Calendar */}
      {showDateOverlay && (
        <CalendarDateRangeOverlay
          range={dateRange}
          setRange={setDateRange}
          onClose={() => setShowDateOverlay(false)}
        />
      )}
    </div>
  );
};

export default FilterPanel;
