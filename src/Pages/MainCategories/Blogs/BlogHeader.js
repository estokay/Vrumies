import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogHeader.css';

const BlogHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div style={{ ...styles.container, height: '260px' }}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>BLOG POSTS</span>
        </h1>
        <p style={styles.subtitle}>PROMOTE AND SHARE YOUR AUTOMOTIVE BLOGS</p>
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

      

      
      
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    color: '#fff',
    padding: '20px 40px',
    fontFamily: "'Arial', sans-serif",
    backgroundImage: 'url("https://blog.shift4shop.com/hubfs/How%20to%20Manage%20an%20eCommerce%20Blog.jpg")',
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
    textShadow: '2px 2px 6px #000',
  },
  subtitle: {
    marginTop: '8px',
    fontWeight: '600',
    fontSize: '18px',
    letterSpacing: '1.5px',
    textAlign: 'left',
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
};

export default BlogHeader;
