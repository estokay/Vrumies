import React from "react";
import "./SellerSidePanel.css";

export default function SellerSidePanel({ selectedIndex, onCardClick }) {
  const orders = [
    { title: "Hammaka Hitch Stand Combo", id: "#254685", date: "06/06/2023", price: "$65.00", type: "Market" },
    { title: "Cars & Coffee Meetup", id: "#254686", date: "06/06/2023", price: "$65.00", type: "Event" },
    { title: "Frame & Body Repair Service", id: "#254687", date: "06/06/2023", price: "$65.00", type: "Directory" },
    { title: "Hammaka Hitch Stand Combo", id: "#254688", date: "06/06/2023", price: "$65.00", type: "Market" },
  ];

  const typeColors = {
    Market: "#FF6B6B",
    Directory: "#4ECDC4",
    Event: "#FFD93D",
  };

  return (
    <div className="orders-side-panel">
      <h2 className="orders-title">ORDER LIST</h2>
      <div className="orders-list">
        {orders.map((order, index) => (
          <div
            key={index}
            className={`order-card ${selectedIndex === index ? "highlight" : ""}`}
            onClick={() => onCardClick && onCardClick(index)}
          >
            <div
              className="order-type"
              style={{ backgroundColor: typeColors[order.type] }}
            >
              {order.type}
            </div>
            <div className="order-title">{order.title}</div>
            <div className="order-details">
              <span>{order.id}</span>
              <span>{order.date}</span>
              <span>{order.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
