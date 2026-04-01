import React from "react";
import { FaTruck, FaStore, FaList, FaTag, FaWrench } from "react-icons/fa";
import "./OrderList.css";

export default function OrderList({ orders, onCardClick }) {
  if (orders.length === 0) {
    return <div className="ol-empty">No orders found.</div>;
  }

  return (
    <div className="ol-list">
      {orders.map((order) => {
        const status = getStatus(order);
        const Icon = getIcon(order.type);

        return (
          <div
            key={order.id}
            className="ol-card"
            onClick={() => onCardClick(order)}
          >
            <div className={`ol-icon ${order.type}`}>
              <Icon />
            </div>

            <div className="ol-body">
              <div className="ol-title">
                {order.postData?.title || "Untitled Order"}
              </div>
              <div className="ol-sub">
                {order.orderCreated?.toDate().toLocaleDateString()} •{" "}
                {order.type.toUpperCase()}
              </div>
            </div>

            <div className={`ol-status status-${status.replace(" ", "-")}`}>
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// helpers
function getStatus(data) {
  if (data?.buyerInfo?.buyerDispute || data?.sellerInfo?.sellerDispute) return "dispute";
  if (data?.buyerInfo?.buyerMarkedCompleted && data?.sellerInfo?.sellerMarkedCompleted) return "completed";
  return "in progress";
}

function getIcon(type) {
  switch (type) {
    case "market": return FaStore;
    case "directory": return FaWrench;
    case "trucks": return FaTruck;
    case "offer": return FaTag;
    default: return FaList;
  }
}