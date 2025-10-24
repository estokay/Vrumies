import React from "react";
import "./SellerSidePanel.css";

export default function SellerSidePanel({ selectedIndex, onCardClick }) {
  const orders = [
    { title: "Hammaka Hitch Stand Combo", date: "06/06/2023", status: "in progress", type: "Market" },
    { title: "Cars & Coffee Meetup", date: "06/06/2023", status: "in progress", type: "Event" },
    { title: "Frame & Body Repair Service", date: "06/06/2023", status: "in progress", type: "Directory" },
  ];

  const typeColors = {
    Market: "#FF6B6B",
    Directory: "#4ECDC4",
    Event: "#FFD93D",
  };

  return (
    <div className="seller-side-panel">
      <h2 className="seller-title">ORDER LIST</h2>
      <div className="seller-list">
        {orders.map((order, index) => (
          <div
            key={index}
            className={`seller-card ${selectedIndex === index ? "highlight" : ""}`}
            onClick={() => onCardClick && onCardClick(index)}
          >
            <div className="seller-card-title">{order.title}</div>
            <div className="seller-card-bottom">
              <span
                className="seller-card-type"
                style={{ backgroundColor: typeColors[order.type] }}
              >
                {order.type}
              </span>
              <span className="seller-card-date">{order.date}</span>
              <span className="seller-card-status">{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
