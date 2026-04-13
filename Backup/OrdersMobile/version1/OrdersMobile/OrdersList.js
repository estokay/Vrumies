import React from "react";
import { FaTruck, FaStore, FaList, FaTag, FaWrench } from "react-icons/fa";
import "./OrdersList.css";

export default function OrdersList({ orders, onCardClick }) {
  if (orders.length === 0) return <div className="bl-empty">No orders found.</div>;

  return (
    <div className="bl-list">
      {orders.map((order) => {
        const status = getStatus(order);
        const Icon = getIcon(order.type);

        return (
          <div key={order.id} className="bl-card" onClick={() => onCardClick(order)}>
            <div className={`bl-icon ${order.type}`}>
              <Icon />
            </div>
            <div className="bl-body">
              <div className="bl-title">{order.postData?.title || "Untitled Order"}</div>
              <div className="bl-sub">
                {new Date(order.orderCreated?.seconds * 1000).toLocaleDateString()} • {order.type.toUpperCase()}
              </div>
            </div>
            <div className={`bl-status status-${status.replace(" ", "-")}`}>
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStatus(data) {
  if (data?.buyerInfo?.buyerDispute || data?.sellerInfo?.sellerDispute) return "dispute";
  if (data?.buyerInfo?.buyerMarkedCompleted && data?.sellerInfo?.sellerMarkedCompleted) return "completed";
  return "in progress";
}

function getIcon(type) {
  switch (type) {
    case "market": return FaStore;
    case "trucks": return FaTruck;
    case "directory": return FaWrench;
    case "offer": return FaTag;
    default: return FaList;
  }
}