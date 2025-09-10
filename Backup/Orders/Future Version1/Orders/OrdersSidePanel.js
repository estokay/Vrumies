import React from "react";
import "./OrdersSidePanel.css";

export default function OrdersSidePanel({ orders, selectedIndex, onCardClick }) {
  const typeColors = {
    Market: "#FF6B6B",
    Directory: "#4ECDC4",
    Event: "#FFD93D",
  };

  return (
    <div className="orders-side-panel">
      <h2 className="orders-title">ORDER LIST</h2>
      <div className="orders-list">
        {orders.length === 0 && <div>No orders yet</div>}
        {orders.map((order, index) => (
          <div
            key={order.id}
            className={`order-card ${selectedIndex === index ? "highlight" : ""}`}
            onClick={() => onCardClick && onCardClick(index)}
          >
            <div
              className="order-type"
              style={{ backgroundColor: typeColors[order.postType] }}
            >
              {order.postType}
            </div>
            <div className="order-title">{order.postData.title || "No Title"}</div>
            <div className="order-details">
              <span>{`#${order.postId}`}</span>
              <span>{order.timestamp?.toDate().toLocaleDateString() || "Unknown Date"}</span>
              <span>${order.price?.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
