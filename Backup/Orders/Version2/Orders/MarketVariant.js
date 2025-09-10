import React from "react";
import { FaCheck } from "react-icons/fa";
import "./MarketVariant.css";

export default function MarketVariant() {
  return (
    <div className="mv-panel">
      <h2 className="mv-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="mv-section">
        <h3>Order Details</h3>
        <div className="mv-info">
          <div><strong>Order Number</strong><p>254685</p></div>
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Market</p></div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <p>13251 Marylane Drive, Houston TX 77024</p>
        </div>

        {/* Carrier + Tracking side by side */}
        <div className="mv-tracking-display">
          <div>
            <strong>Carrier</strong>
            <p>FEDEX</p>
          </div>
          <div>
            <strong>Tracking Number</strong>
            <p>452520484968</p>
          </div>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="mv-section">
        <h3>Ordered Items</h3>
        <div className="mv-item">
          <img
            src="https://m.media-amazon.com/images/I/61TDUwjqKCL._UF894,1000_QL80_.jpg"
            alt="Product"
          />
          <div>
            <div><strong>Title</strong><p>Hammaka Hitch Stand Combo</p></div>
            <div><strong>Price</strong><p>$375.99</p></div>
            <button className="mv-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="mv-section">
        <h3>Payment Information</h3>
        <div className="mv-payment">
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
      <section className="mv-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>Gryan Dumimson</p></div>
        <div><strong>Location</strong><p>Dallas, TX</p></div>
        <button className="mv-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="mv-section">
        <h3>Status</h3>
        <div className="mv-timeline-wrapper">
          <div className="mv-timeline-step">
            <div className="mv-circle active"><FaCheck /></div>
            <p className="mv-timeline-label active-label">Order Started</p>
          </div>
          <div className="mv-arrow">→</div>
          <div className="mv-timeline-step">
            <div className="mv-circle"></div>
            <p className="mv-timeline-label">Marked Completed by Seller</p>
          </div>
          <div className="mv-arrow">→</div>
          <div className="mv-timeline-step">
            <div className="mv-circle"></div>
            <p className="mv-timeline-label">Completed</p>
          </div>
        </div>

        <div className="mv-status-buttons">
          <button className="mv-btn-complete">Mark as Completed</button>
          <button className="mv-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
