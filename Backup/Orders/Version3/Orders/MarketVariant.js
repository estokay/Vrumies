import React from "react";
import { FaCheck } from "react-icons/fa";
import "./MarketVariant.css";

export default function MarketVariant() {
  return (
    <div className="mv-custom-panel">
      <h2 className="mv-custom-title">ORDER INFORMATION</h2>

      {/* Order Details */}
      <section className="mv-custom-section">
        <h3>Order Details</h3>
        <div className="mv-custom-info">
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Market</p></div>
          <div><strong>Order ID</strong><p>8YZhtcRYBNAimRM7qJ5W</p></div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <p>13251 Marylane Drive, Houston TX 77024</p>
        </div>

        {/* Carrier + Tracking side by side */}
        <div className="mv-custom-tracking-display">
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
      <section className="mv-custom-section">
        <h3>Ordered Items</h3>
        <div className="mv-custom-item">
          <img
            src="https://m.media-amazon.com/images/I/61TDUwjqKCL._UF894,1000_QL80_.jpg"
            alt="Product"
          />
          <div>
            <div><strong>Title</strong><p>Hammaka Hitch Stand Combo</p></div>
            <div><strong>Description</strong><p>Upgrade your outdoor relaxation setup with the Hammaka Hitch Stand Combo – the ultimate solution for effortless comfort anywhere! This versatile combo includes a durable hitch-mounted stand and a premium hammock, providing a secure and portable lounging experience. Crafted with high-quality materials, the stand supports your hammock safely while being easy to assemble and transport. Perfect for camping, tailgating, backyard lounging, or road trips, the Hammaka Hitch Stand Combo delivers unmatched convenience and relaxation. Lightweight yet sturdy, it’s designed to fit most vehicles with a standard hitch receiver, giving you the freedom to unwind wherever you go.</p></div>
            <button className="mv-custom-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="mv-custom-section">
        <h3>Payment Information</h3>
        <div className="mv-custom-payment">
          <div>
            <strong>Price</strong><p>$375.99</p>
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
      <section className="mv-custom-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>Gryan Dumimson</p></div>
        <button className="mv-custom-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="mv-custom-section">
        <h3>Status</h3>
        <div className="mv-custom-timeline-wrapper">
          <div className="mv-custom-timeline-step">
            <div className="mv-custom-circle active"><FaCheck /></div>
            <p className="mv-custom-timeline-label active-label">Order Started</p>
          </div>
          <div className="mv-custom-arrow">→</div>
          <div className="mv-custom-timeline-step">
            <div className="mv-custom-circle"></div>
            <p className="mv-custom-timeline-label">Marked Completed by Seller</p>
          </div>
          <div className="mv-custom-arrow">→</div>
          <div className="mv-custom-timeline-step">
            <div className="mv-custom-circle"></div>
            <p className="mv-custom-timeline-label">Completed</p>
          </div>
        </div>

        <div className="mv-custom-status-buttons">
          <button className="mv-custom-btn-complete">Mark as Completed</button>
          <button className="mv-custom-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
