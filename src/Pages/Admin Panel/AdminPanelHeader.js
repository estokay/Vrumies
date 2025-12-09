import React from 'react';

const MarketHeader = () => {
  return (
    <div style={{ ...styles.container, height: '130px', minHeight: undefined }}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>ADMIN PANEL</span>
        </h1>
        <p style={styles.subtitle}>
          Moderation and database editing.
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
      {/* bottomBar removed completely */}
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
      'url("https://www.datapath.co.uk/wp-content/uploads/CCTV-control-room-2.jpg")',
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
  },
  rightSide: {
    position: 'absolute',
    top: '20px',
    right: '40px',
    opacity: 0.8,
  },
};

export default MarketHeader;
