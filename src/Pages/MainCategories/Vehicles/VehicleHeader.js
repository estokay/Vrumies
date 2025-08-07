import React from 'react';

const VehicleHeader = () => {
  return (
    <div style={{ ...styles.container, height: '260px' }}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>CONTENT POSTS</span>
        </h1>
        <p style={styles.subtitle}>PROMOTE AND SHARE YOUR AUTOMOTIVE CONTENT</p>
      </div>
      <div style={styles.rightSide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#39FF14"
          width="70px"
          height="70px"
          style={{ filter: 'drop-shadow(0 0 3px #39FF14)' }}
        >
          <path d="M20 5h-3.586l-1.707-1.707A.996.996 0 0014 3H10c-.265 0-.52.105-.707.293L7.586 5H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2zM12 17a5 5 0 110-10 5 5 0 010 10zM12 9a3 3 0 100 6 3 3 0 000-6z"/>
        </svg>
      </div>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>Videos</li>
          <li style={styles.navItem}>Blogs</li>
          <li style={styles.navItem}>Forums</li>
          <li style={{ ...styles.navItem, ...styles.activeNavItem }}>Vehicles</li>
        </ul>
      </nav>

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
    backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    overflow: 'hidden',
    // height will be overridden inline to 260px
  },
  leftSide: {
    maxWidth: '50%',
  },
  title: {
    fontSize: '48px',
    fontWeight: '900',
    margin: 0,
    letterSpacing: '2px',
    textAlign: 'left', // <-- Left aligned title
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
    textAlign: 'left', // <-- Left aligned subtitle
  },
  rightSide: {
    position: 'absolute',
    top: '20px',
    right: '40px',
    opacity: 0.8,
  },
  nav: {
    marginTop: '40px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    gap: '30px',
    fontWeight: '700',
    fontSize: '20px',
  },
  navItem: {
    color: '#aaa',
    cursor: 'pointer',
  },
  activeNavItem: {
    color: '#00FF00',
    fontWeight: '900',
    borderBottom: '2px solid #00FF00',
    paddingBottom: '4px',
  },
  bottomBar: {
    marginTop: '30px',
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
  }
};

export default VehicleHeader;
