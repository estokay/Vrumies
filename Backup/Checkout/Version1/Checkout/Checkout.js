import React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutHeader from './CheckoutHeader';
import CheckoutBody from './CheckoutBody';
import '../../App.css';
import './Checkout.css';

// Initialize Stripe
const stripePromise = loadStripe("pk_live_51JN8mDDR30hjV6c21Ni6BomHMySk86EywjrEhOiNg50zMCTOrOMUP6hPapaoco6ROfs0OqhAHWb8u1Pu8C9LlMFV00XLvfzaLK"); // Replace with your Stripe publishable key

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="content-page">
        {/* Header Section */}
        <CheckoutHeader />

        {/* Main Checkout Form */}
        <div className="checkout-main">
          <CheckoutBody />
        </div>
      </div>
    </Elements>
  );
};

export default Checkout;
