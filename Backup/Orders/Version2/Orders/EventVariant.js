import React from "react";
import "./EventVariant.css";
import { FaFilePdf, FaCheck } from "react-icons/fa";

export default function EventVariant() {
  return (
    <div className="event-details-panel">
      <h2 className="panel-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="section">
        <h3>Order Details</h3>
        <div className="order-info">
          <div><strong>Order Number</strong><p>254685</p></div>
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Event</p></div>
        </div>

        <div className="ticket-file">
          <strong>Ticket File:</strong>
          <div className="ticket-download">
            <FaFilePdf className="ticket-icon" />
            <div>
              <p className="ticket-name">Cars-Coffee-General-Admission.pdf</p>
              <a href="#" className="ticket-link">Download File</a>
            </div>
          </div>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="section">
        <h3>Ordered Items</h3>
        <div className="item-card">
          <img src="https://www.nrgpark.com/wp-content/uploads/event-super-car-show.webp" alt="Product" />
          <div>
            <div><strong>Title</strong><p>Cars & Cofee Meetup</p></div>
            <div><strong>Price</strong><p>$25.00</p></div>
            <button className="btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="section">
        <h3>Payment Information</h3>
        <div className="payment-info">
          <div>
            <strong>Subtotal</strong><p>$25.00</p>
            <strong>Transaction Fee (15%)</strong><p>$3.75</p>
            <strong>Total</strong><p>$28.75</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>Card</p>
            <strong>Last 4 digits of Card</strong><p>4565</p>
          </div>
        </div>
      </section>

      {/* Seller Information */}
      <section className="section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>Gryan Dumimson</p></div>
        <div><strong>Location</strong><p>Dallas, TX</p></div>
        <button className="btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="section">
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
