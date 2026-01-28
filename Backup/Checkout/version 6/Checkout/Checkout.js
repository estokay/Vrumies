import React from 'react';
import CheckoutHeader from './CheckoutHeader';
import CheckoutBodyStandalone from './CheckoutBody'; // Standalone version
import '../../App.css';
import './Checkout.css';

const Checkout = () => {
  return (
    <div className="content-page">
      {/* Header Section */}
      <CheckoutHeader />

      {/* Main Checkout Form */}
      <div className="co-checkout-main">
        <CheckoutBodyStandalone />
      </div>
    </div>
  );
};

export default Checkout;
