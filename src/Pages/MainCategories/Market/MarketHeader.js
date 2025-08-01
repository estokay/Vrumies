import React from 'react';

const MarketHeader = () => {
  return (
    <div style={{ ...styles.container, height: '260px', minHeight: undefined }}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>MARKET POSTS</span>
        </h1>
        <p style={styles.subtitle}>
          MAKE A MARKET POST TO PROMOTE YOUR AUTOMOTIVE PRODUCTS
        </p>
      </div>
      <div style={styles.rightSide}>
        <img
          src={`${process.env.PUBLIC_URL}/request-icon.png`}
          alt="Market Icon"
          width="70"
          height="70"
          style={{ filter: 'drop-shadow(0 0 3px #39FF14)' }}
        />
      </div>

      <div style={styles.bottomBar}>
        <button style={styles.locationButton}>
          <span role="img" aria-label="location">📍</span> Location of Post
        </button>

        <select style={styles.select}>
          <option>Filter Options ▼</option>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>

        <select style={styles.select}>
          <option>Sort By Best Match ▼</option>
          <option>Newest</option>
          <option>Oldest</option>
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
      'url("https://kupiiline.com/wp-content/uploads/2023/08/capture-51.webp")',
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
    textAlign: 'left',  // added for left alignment
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
    textAlign: 'left',  // added for left alignment
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
  locationButton: {
    border: '1px solid #00FF00',
    background: 'black',
    color: '#00FF00',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
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

export default MarketHeader;
