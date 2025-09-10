import React from "react";
import { FaCheck } from "react-icons/fa";
import "./MarketVariant.css";

export default function MarketVariant({ order, post }) {
  const { buyerInfo } = order;

  return (
    <div className="mv-panel">
      <h2 className="mv-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="mv-section">
        <h3>Order Details</h3>
        <div className="mv-info">
          <div><strong>Order Number</strong><p>{order.id}</p></div>
          <div><strong>Date</strong><p>{order.timestamp?.toDate().toLocaleDateString()}</p></div>
          <div><strong>Type</strong><p>{post.type}</p></div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <p>{buyerInfo.address}, {buyerInfo.city} {buyerInfo.state} {buyerInfo.zip}</p>
        </div>

        {/* Carrier + Tracking side by side */}
        {post.carrier && post.trackingNumber && (
          <div className="mv-tracking-display">
            <div>
              <strong>Carrier</strong>
              <p>{post.carrier}</p>
            </div>
            <div>
              <strong>Tracking Number</strong>
              <p>{post.trackingNumber}</p>
            </div>
          </div>
        )}
      </section>

      {/* Ordered Items */}
      <section className="mv-section">
        <h3>Ordered Items</h3>
        <div className="mv-item">
          <img src={post.image} alt={post.title} />
          <div>
            <div><strong>Title</strong><p>{post.title}</p></div>
            <div><strong>Price</strong><p>${order.price.toFixed(2)}</p></div>
            <button className="mv-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="mv-section">
        <h3>Payment Information</h3>
        <div className="mv-payment">
          <div>
            <strong>Subtotal</strong><p>${order.price.toFixed(2)}</p>
            <strong>Transaction Fee (15%)</strong><p>${(order.price * 0.15).toFixed(2)}</p>
            <strong>Total</strong><p>${(order.price * 1.15).toFixed(2)}</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>{order.paymentMethod}</p>
          </div>
        </div>
      </section>

      {/* Seller Information */}
      <section className="mv-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>{post.sellerName}</p></div>
        <div><strong>Location</strong><p>{post.sellerLocation}</p></div>
        <button className="mv-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="mv-section">
        <h3>Status</h3>
        <div className="mv-timeline-wrapper">
          <div className="mv-timeline-step">
            <div className={`mv-circle ${order.status >= 1 ? "active" : ""}`}><FaCheck /></div>
            <p className={`mv-timeline-label ${order.status >= 1 ? "active-label" : ""}`}>Order Started</p>
          </div>
          <div className="mv-arrow">→</div>
          <div className="mv-timeline-step">
            <div className={`mv-circle ${order.status >= 2 ? "active" : ""}`}></div>
            <p className={`mv-timeline-label ${order.status >= 2 ? "active-label" : ""}`}>Marked Completed by Seller</p>
          </div>
          <div className="mv-arrow">→</div>
          <div className="mv-timeline-step">
            <div className={`mv-circle ${order.status >= 3 ? "active" : ""}`}></div>
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
