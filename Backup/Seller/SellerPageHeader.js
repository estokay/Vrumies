import React from 'react';

const SellerPageHeader = () => {
  return (
    <div style={{ ...styles.container, height: '260px' }}>
      {/* Left side text */}
      <div style={styles.leftSide}>
        <h1 style={styles.title}>
          <span style={styles.greenHighlight}>SELLER</span>
        </h1>
        <p style={styles.subtitle}>
          View and track your customer orders here.
        </p>
      </div>

      {/* Right-side icon */}
      <div style={styles.rightSide}>
        <img
          src={`${process.env.PUBLIC_URL}/request-icon.png`}
          alt="OrdersPage Icon"
          width="70"
          height="70"
          style={{ filter: 'drop-shadow(0 0 3px #39FF14)' }}
        />
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        {/* Left: Create Sell Post */}
        <button style={styles.createPostButton}>
          Create Sell Post
        </button>

        {/* Right: Balance + Payout */}
        <div style={styles.balanceContainer}>
          <div style={styles.balanceLabel}>TOTAL BALANCE</div>
          <div style={styles.balanceValue}>$56.95</div>
          <button style={styles.payoutButton}>
            Payout Methods
          </button>
        </div>
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
      'url("https://uptivity.co.uk/wp-content/uploads/2021/07/female-seller-scanning-ecommerce-shipping-box-in-d-Y9FABLM-scaled.jpg")',
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
bottomBar: {
  position: 'absolute',
  bottom: '20px',              // stick buttons near bottom but inside header
  left: '40px',
  right: '40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
},

  // Buttons & Balance
  createPostButton: {
    background: 'linear-gradient(to right, #8B0000, #FF0000)',
    border: 'none',
    padding: '19px 31px',
    borderRadius: '40px',
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.4)',
    marginTop: '80px',
  },
  balanceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    backgroundColor: 'black',    // ⬅ black background
    padding: '18px 30px',        // ⬅ spacing inside
    borderRadius: '8px',
  },
  balanceLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
  },
  balanceValue: {
    fontSize: '42px',
    fontWeight: '900',
    color: '#fff',
    alignSelf: 'center',
  },
  payoutButton: {
    background: 'linear-gradient(to right, #800080, #FF00FF)',
    border: 'none',
    padding: '15px 80px',
    borderRadius: '40px',
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.4)',
  },
};

export default SellerPageHeader;
