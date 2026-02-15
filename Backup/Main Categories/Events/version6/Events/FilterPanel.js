import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../../Components/Css/MainFilterPanel.css';
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";

const FilterPanel = ({ searchQuery = '', onFilteredPosts }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState('Show All');
  const [sortBy, setSortBy] = useState('Show All');
  const [availableEventDates, setAvailableEventDates] = useState([]); // yyyy-mm-dd strings
  const [selectedEventDates, setSelectedEventDates] = useState([]);
  const eventDatesAsDateObjects = availableEventDates.map(
    d => new Date(d + "T00:00:00")
  );

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

      // 🔹 Unique event dates (yyyy-mm-dd)
      const dates = Array.from(
        new Set(
          posts
            .filter(p => p.eventDateTime?.seconds)
            .map(p =>
              new Date(p.eventDateTime.seconds * 1000)
                .toISOString()
                .split('T')[0]
            )
        )
      );

      setAvailableEventDates(dates);
    

      
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

    // Event Filtering
    if (selectedEventDates.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.eventDateTime?.seconds) return false;

        const eventDate = new Date(p.eventDateTime.seconds * 1000);

        return selectedEventDates.some(
          selected =>
            selected.toDateString() === eventDate.toDateString()
        );
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
    selectedEventDates,
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

      {/* EVENT DATE */}
      <div className="filterpanel-section">
        <div
          className="filterpanel-header"
          onClick={() => toggleSection("eventDate")}
        >
          Event Date <span>{sectionsOpen.eventDate ? "−" : "+"}</span>
        </div>

        {sectionsOpen.eventDate && (
          <div className="filterpanel-options">
            <DayPicker
              mode="multiple"
              selected={selectedEventDates}
              onSelect={setSelectedEventDates}
              modifiers={{
                hasEvent: eventDatesAsDateObjects
              }}
              modifiersClassNames={{
                hasEvent: "rdp-day-has-event"
              }}
              disabled={(date) =>
                !eventDatesAsDateObjects.some(
                  (d) => d.toDateString() === date.toDateString()
                )
              }
              className="event-date-calendar"
            />

            {selectedEventDates.length > 0 && (
              <button
                className="clear-dates-btn"
                onClick={() => setSelectedEventDates([])}
              >
                Clear dates
              </button>
            )}
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
