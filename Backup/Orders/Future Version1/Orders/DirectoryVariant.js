import React from "react";
import { FaCheck } from "react-icons/fa";
import "./DirectoryVariant.css";

export default function DirectoryVariant({ order, post }) {
  const { buyerInfo } = order;

  return (
    <div className="order-details-panel">
      <h2 className="panel-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="section">
        <h3>Order Details</h3>
        <div className="order-info">
          <div><strong>Order Number</strong><p>{order.id}</p></div>
          <div><strong>Date</strong><p>{order.timestamp?.toDate().toLocaleDateString()}</p></div>
          <div><strong>Type</strong><p>{post.type}</p></div>
        </div>
        <div>
          <strong>Service Location</strong>
          <p>{buyerInfo.address}, {buyerInfo.city} {buyerInfo.state} {buyerInfo.zip}</p>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="section">
        <h3>Ordered Items</h3>
        <div className="item-card">
          <img src={post.image} alt={post.title} />
          <div>
            <div><strong>Title</strong><p>{post.title}</p></div>
            <div><strong>Price</strong><p>${order.price.toFixed(2)}</p></div>
            <button className="btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="section">
        <h3>Payment Information</h3>
        <div className="payment-info">
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
      <section className="section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>{post.sellerName}</p></div>
        <div><strong>Location</strong><p>{post.sellerLocation}</p></div>
        <button className="btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="section">
        <h3>Status</h3>
        <div className="timeline-wrapper">
          <div className="timeline-step">
            <div className={`circle ${order.status >= 1 ? "active" : ""}`}><FaCheck /></div>
            <p className={`timeline-label ${order.status >= 1 ? "active-label" : ""}`}>Order Started</p>
          </div>
          <div className="arrow">→</div>
          <div className="timeline-step">
            <div className={`circle ${order.status >= 2 ? "active" : ""}`}></div>
            <p className={`timeline-label ${order.status >= 2 ? "active-label" : ""}`}>Marked Completed by Seller</p>
          </div>
          <div className="arrow">→</div>
          <div className="timeline-step">
            <div className={`circle ${order.status >= 3 ? "active" : ""}`}></div>
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
