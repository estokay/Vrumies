import React from "react";
import "./DirectoryVariant.css";
import { FaCheck } from "react-icons/fa";

export default function DirectoryVariant() {
  return (
    <div className="od-order-details-panel">
      <h2 className="od-panel-title">ORDER INFORMATION</h2>

      {/* Order Details */}
      <section className="od-section">
        <h3>Order Details</h3>
        <div className="od-order-info">
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Directory</p></div>
          <div><strong>Order ID</strong><p>8YZhtcRYWNAimRM7qJ5W</p></div>
        </div>
        <div>
          <strong>Service Address</strong>
          <p>13251 Marylane Drive, Houston TX 77024</p>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="od-section">
        <h3>Ordered Items</h3>
        <div className="od-item-card">
          <img
            src="https://jntautomotive.com/wp-content/uploads/2025/01/hm-brake-repair-service-01.jpg"
            alt="Product"
          />
          <div>
            <div><strong>Title</strong><p>Frame & Body Repair Service</p></div>
            <div><strong>Description</strong><p>
              Restore your vehicle to its original condition with our expert Frame & Body Repair Service. Whether it’s a minor dent, a major collision, or structural damage, our certified technicians use state-of-the-art equipment and proven techniques to ensure your car looks and drives like new. From precision frame alignment to flawless paint matching, we handle every repair with attention to detail and quality craftsmanship.
            </p></div>
            <button className="od-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="od-section">
        <h3>Payment Information</h3>
        <div className="od-payment-info">
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

      {/* Seller Information */}
      <section className="od-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>Gryan Dumimson</p></div>
        <button className="od-btn-message">Message User</button>
      </section>

      {/* Status Section from EventVariant */}
      <section className="od-section">
        <h3>Status</h3>
        <div className="od-timeline-wrapper">
          <div className="od-timeline-step">
            <div className="od-circle active"><FaCheck /></div>
            <p className="od-timeline-label active-label">Order Started</p>
          </div>
          <div className="od-arrow">→</div>
          <div className="od-timeline-step">
            <div className="od-circle"></div>
            <p className="od-timeline-label">Marked Completed by Seller</p>
          </div>
          <div className="od-arrow">→</div>
          <div className="od-timeline-step">
            <div className="od-circle"></div>
            <p className="od-timeline-label">Completed</p>
          </div>
        </div>

        <div className="od-status-buttons">
          <button className="od-btn-complete">Mark as Completed</button>
          <button className="od-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
