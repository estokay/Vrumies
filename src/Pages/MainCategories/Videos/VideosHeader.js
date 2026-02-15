import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoHeader.css';
import { FaVideo } from "react-icons/fa";

const VideoHeader = () => {
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  return (
    <div style={{ ...styles.container, height: '260px' }}>
      {/* Left Side Title */}
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>VIDEO POSTS</span>
        </h1>
        <p style={styles.subtitle}>PROMOTE AND SHARE YOUR AUTOMOTIVE VIDEOS</p>
      </div>
      <div style={styles.rightSide}>
        <FaVideo
          size={70}
          color="#39FF14"
          style={{
            filter: "drop-shadow(0 0 6px #39FF14)",
          }}
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
    backgroundImage: 'url("https://cdn.skoda-storyboard.com/2018/08/influencer-bloger-event-skoda-classic-car.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  leftSide: { maxWidth: '50%' },
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
  nav: { marginTop: '40px' },
  navList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    gap: '30px',
    fontWeight: '700',
    fontSize: '20px',
  },
  navItem: { color: '#aaa', cursor: 'pointer' },
  activeNavItem: {
    color: '#00FF00',
    fontWeight: '900',
    borderBottom: '2px solid #00FF00',
    paddingBottom: '4px',
  },
};

export default VideoHeader;
