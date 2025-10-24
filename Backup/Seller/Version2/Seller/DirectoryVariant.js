import React from "react";
import "./DirectoryVariant.css";
import { FaCheck } from "react-icons/fa";

export default function DirectoryVariant() {
  return (
    <div className="seller-order-details-panel">
      <h2 className="seller-panel-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="seller-section">
        <h3>Order Details</h3>
        <div className="seller-order-info">
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Directory</p></div>
          <div><strong>Order ID</strong><p>254685</p></div>
        </div>
        <div>
          <strong>Service Location</strong>
          <p>13251 Marylane Drive, Houston TX 77024</p>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="seller-section">
        <h3>Ordered Items</h3>
        <div className="seller-item-card">
          <img
            src="https://jntautomotive.com/wp-content/uploads/2025/01/hm-brake-repair-service-01.jpg"
            alt="Product"
          />
          <div>
            <div><strong>Title</strong><p>Frame & Body Repair Service</p></div>
            <div><strong>Description</strong><p>Restore your vehicle to its original condition with our expert Frame & Body Repair Service. Whether it’s a minor dent, a major collision, or structural damage, our certified technicians use state-of-the-art equipment and proven techniques to ensure your car looks and drives like new. From precision frame alignment to flawless paint matching, we handle every repair with attention to detail and quality craftsmanship.</p></div>
            <button className="seller-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="seller-section">
        <h3>Payment Information</h3>
        <div className="seller-payment-info">
          <div>
            <strong>Price</strong><p>$550.00</p>
            <strong>Transaction Fee (15%)</strong><p>$82.50</p>
            <strong>Total</strong><p>$632.50</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>Card</p>
            <strong>Last 4 digits of Card</strong><p>4565</p>
          </div>
        </div>
      </section>

      {/* Buyer Information */}
      <section className="seller-section">
        <h3>Buyer Information</h3>
        <div><strong>Buyer</strong><p>Gryan Dumimson</p></div>
        <button className="seller-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="seller-section">
        <h3>Status</h3>
        <div className="seller-timeline-wrapper">
          <div className="seller-timeline-step">
            <div className="seller-circle active"><FaCheck /></div>
            <p className="seller-timeline-label seller-active-label">Order Started</p>
          </div>
          <div className="seller-arrow">→</div>
          <div className="seller-timeline-step">
            <div className="seller-circle"></div>
            <p className="seller-timeline-label">Marked Completed by Buyer</p>
          </div>
          <div className="seller-arrow">→</div>
          <div className="seller-timeline-step">
            <div className="seller-circle"></div>
            <p className="seller-timeline-label">Completed</p>
          </div>
        </div>

        <div className="seller-status-buttons">
          <button className="seller-btn-complete">Mark as Completed</button>
          <button className="seller-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
