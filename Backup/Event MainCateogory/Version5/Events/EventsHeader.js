import React, { useState } from 'react';

const EventsHeader = () => {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  return (
    <div style={{ ...styles.container, height: '260px', minHeight: undefined }}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>EVENT POSTS</span>
        </h1>
        <p style={styles.subtitle}>
          PROMOTE AND SHARE YOUR AUTOMOTIVE EVENTS
        </p>
      </div>
      <div style={styles.rightSide}>
        <img
          src={`${process.env.PUBLIC_URL}/request-icon.png`}
          alt="Events Icon"
          width="70"
          height="70"
          style={{ filter: 'drop-shadow(0 0 3px #39FF14)' }}
        />
      </div>

      <div style={styles.bottomBar}>
        <input
          type="text"
          placeholder="City"
          style={styles.locationInput}
        />

        <select
          style={styles.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="" disabled>
            Filter ▼
          </option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>

        <select
          style={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="" disabled>
            Sort By ▼
          </option>
          <option value="Best Match">Best Match</option>
          <option value="Newest">Newest</option>
          <option value="Likes">Likes</option>
          <option value="Highest Rating">Highest Rating</option>
        </select>

        <input
          type="search"
          placeholder="Type your search here..."
          style={styles.searchInput}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    color: '#fff',
    padding: '20px 40px',
    fontFamily: "'Arial', sans-serif",
    backgroundImage:
      'url("https://images.squarespace-cdn.com/content/v1/6598c8e83ff0af0197ff19f9/a05c7d5e-3711-48bb-a4c8-f3ce0f076355/JCCI-2024-Banner.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  leftSide: {
    maxWidth: '50%',
  },
  title: {
    fontSize: '48px',
    fontWeight: '900',
    margin: 0,
    letterSpacing: '2px',
    textAlign: 'left',
    textShadow: '2px 2px 6px #000',
  },
  greenHighlight: {
    color: '#00FF00',
    textShadow: '1px 1px 0 #000',
  },
  subtitle: {
    marginTop: '8px',
    fontWeight: '600',
    fontSize: '18px',
    letterSpacing: '1.5px',
    textAlign: 'left',
    textShadow: '2px 2px 6px #000',
  },
  rightSide: {
    position: 'absolute',
    top: '20px',
    right: '40px',
    opacity: 0.8,
  },
  bottomBar: {
    marginTop: '94px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  locationInput: {
    border: '1px solid #00FF00',
    background: 'black',
    color: '#00FF00',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'text',
  },
  select: {
    border: '1px solid #00FF00',
    background: 'black',
    color: '#fff',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchInput: {
    flexGrow: 1,
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
  },
};

export default EventsHeader;
