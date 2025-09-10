import React from 'react';

const OrdersPageHeader = () => {
  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>ORDERS</span>
        </h1>
        <p style={styles.subtitle}>
          View and track your orders here.
        </p>
      </div>
      <div style={styles.rightSide}>
        <img
          src={`${process.env.PUBLIC_URL}/request-icon.png`}
          alt="OrdersPage Icon"
          width="70"
          height="70"
          style={{ filter: 'drop-shadow(0 0 3px #39FF14)' }}
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
      'url("https://completebusinessgroup.com/wp-content/uploads/2017/08/orders-post.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    overflow: 'hidden',
    minHeight: '260px', // keep height consistent
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
    textShadow: '2px 2px 6px #000',
  },
  subtitle: {
    marginTop: '8px',
    fontWeight: '600',
    fontSize: '18px',
    letterSpacing: '1.5px',
    textAlign: 'left',
    textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
  },
  rightSide: {
    position: 'absolute',
    top: '20px',
    right: '40px',
    opacity: 0.8,
  },
};

export default OrdersPageHeader;
