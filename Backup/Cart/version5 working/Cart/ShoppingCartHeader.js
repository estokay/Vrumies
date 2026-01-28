import React from 'react';

const ShoppingCartHeader = () => {
  return (
    <div style={{ ...styles.container, height: '260px' }}>
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>Shopping Cart</span>
        </h1>
        <p style={styles.subtitle}>
          View all items in your cart.
        </p>
      </div>
      <div style={styles.rightSide}>
        <img
          src={`${process.env.PUBLIC_URL}/request-icon.png`}
          alt="ShoppingCart Icon"
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
      'url("https://www.milesweb.in/blog/wp-content/uploads/2015/06/ecommerce-stores-hosted-vs-licensed-shopping-cart-solutions-min-1.jpg")',
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
};

export default ShoppingCartHeader;
