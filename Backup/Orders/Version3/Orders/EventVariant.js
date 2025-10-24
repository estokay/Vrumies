import React from "react";
import "./EventVariant.css";
import { FaFilePdf, FaCheck } from "react-icons/fa";

export default function EventVariant() {
  return (
    <div className="oe-event-details-panel">
      <h2 className="oe-panel-title">ORDER INFORMATION</h2>

      {/* Order Details */}
      <section className="oe-section">
        <h3>Order Details</h3>
        <div className="oe-order-info">
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Event</p></div>
          <div><strong>Order ID</strong><p>8YZhtcRYFNAimRM7qJ5W</p></div>
        </div>

        <div className="oe-ticket-file">
          <strong>Ticket File:</strong>
          <div className="oe-ticket-download">
            <FaFilePdf className="oe-ticket-icon" />
            <div>
              <p className="oe-ticket-name">Cars-Coffee-General-Admission.pdf</p>
              <a href="#" className="oe-ticket-link">Download File</a>
            </div>
          </div>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="oe-section">
        <h3>Ordered Items</h3>
        <div className="oe-item-card">
          <img src="https://www.nrgpark.com/wp-content/uploads/event-super-car-show.webp" alt="Product" />
          <div>
            <div><strong>Title</strong><p>Cars & Cofee Meetup</p></div>
            <div><strong>Description</strong><p>Start your weekend engines and fuel your passion for automobiles at the Cars & Coffee Meetup! Join fellow car enthusiasts for a casual, fun-filled morning where exotic cars, classic rides, and everything in between come together. Enjoy a relaxed atmosphere with coffee, great conversation, and the chance to show off your ride or admire others. Whether you're a seasoned collector, a weekend hobbyist, or simply a car fan, this meetup is the perfect way to connect with like-minded enthusiasts.</p></div>
            <button className="oe-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="oe-section">
        <h3>Payment Information</h3>
        <div className="oe-payment-info">
          <div>
            <strong>Price</strong><p>$25.00</p>
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
      <section className="oe-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>Gryan Dumimson</p></div>
        <button className="oe-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="oe-section">
        <h3>Status</h3>
        <div className="oe-timeline-wrapper">
          <div className="oe-timeline-step">
            <div className="oe-circle active"><FaCheck /></div>
            <p className="oe-timeline-label active-label">Order Started</p>
          </div>
          <div className="oe-arrow">→</div>
          <div className="oe-timeline-step">
            <div className="oe-circle"></div>
            <p className="oe-timeline-label">Marked Completed by Seller</p>
          </div>
          <div className="oe-arrow">→</div>
          <div className="oe-timeline-step">
            <div className="oe-circle"></div>
            <p className="oe-timeline-label">Completed</p>
          </div>
        </div>

        <div className="oe-status-buttons">
          <button className="oe-btn-complete">Mark as Completed</button>
          <button className="oe-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
