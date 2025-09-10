import React from "react";
import { FaCheck } from "react-icons/fa";
import "./MarketVariant.css";

export default function MarketVariant() {
  return (
    <div className="market-panel">
      <h2 className="market-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="market-section">
        <h3>Order Details</h3>
        <div className="market-info">
          <div><strong>Order Number</strong><p>254685</p></div>
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Market</p></div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <p>13251 Marylane Drive, Houston TX 77024</p>
        </div>
        <div>
          <strong>Tracking Number</strong>
          <p className="market-tracking">452520484968</p>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="market-section">
        <h3>Ordered Items</h3>
        <div className="market-item">
          <img
            src="https://m.media-amazon.com/images/I/61TDUwjqKCL._UF894,1000_QL80_.jpg"
            alt="Product"
          />
          <div>
            <div><strong>Title</strong><p>Hammaka Hitch Stand Combo</p></div>
            <div><strong>Price</strong><p>$375.99</p></div>
            <button className="market-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="market-section">
        <h3>Payment Information</h3>
        <div className="market-payment">
          <div>
            <strong>Subtotal</strong><p>$375.99</p>
            <strong>Transaction Fee (15%)</strong><p>$56.40</p>
            <strong>Total</strong><p>$432.39</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>Card</p>
            <strong>Last 4 digits of Card</strong><p>4565</p>
          </div>
        </div>
      </section>

      {/* Seller Information */}
      <section className="market-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>Gryan Dumimson</p></div>
        <div><strong>Location</strong><p>Dallas, TX</p></div>
        <button className="market-btn-message">Message User</button>
      </section>

      {/* Status (from EventVariant) */}
      <section className="market-section">
        <h3>Status</h3>
        <div className="timeline-wrapper">
          <div className="timeline-step">
            <div className="circle active"><FaCheck /></div>
            <p className="timeline-label active-label">Order Started</p>
          </div>
          <div className="arrow">→</div>
          <div className="timeline-step">
            <div className="circle"></div>
            <p className="timeline-label">Marked Completed by Seller</p>
          </div>
          <div className="arrow">→</div>
          <div className="timeline-step">
            <div className="circle"></div>
            <p className="timeline-label">Completed</p>
          </div>
        </div>

        <div className="status-buttons">
          <button className="btn-complete">Mark as Completed</button>
          <button className="btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
