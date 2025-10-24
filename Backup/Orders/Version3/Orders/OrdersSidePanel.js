import React from "react";
import "./OrdersSidePanel.css";

export default function OrdersSidePanel({ selectedIndex, onCardClick }) {
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
    <div className="osp-panel">
      <h2 className="osp-title">ORDER LIST</h2>
      <div className="osp-list">
        {orders.map((order, index) => (
          <div
            key={index}
            className={`osp-card ${selectedIndex === index ? "osp-highlight" : ""}`}
            onClick={() => onCardClick && onCardClick(index)}
          >
            <div className="osp-card-title">{order.title}</div>
            <div className="osp-card-bottom">
              <span className="osp-card-type" style={{ backgroundColor: typeColors[order.type] }}>
                {order.type}
              </span>
              <span className="osp-card-date">{order.date}</span>
              <span className="osp-card-status">{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
