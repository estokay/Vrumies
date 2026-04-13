import React from "react";
import "./OrdersList.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function OrdersList({ orders, expandedOrderId, onToggle }) {
  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="opm-card">
          <div
            className="opm-card-header"
            onClick={() => onToggle(order.id)}
          >
            <p>
              {order.postData?.title || order.type || "Order"} -{" "}
              {new Date(order.orderCreated?.seconds * 1000).toLocaleDateString()}
            </p>

            <div className="opm-card-icons">
              {order.buyerInfo?.buyerDispute && (
                <span className="opm-badge-dispute">⚠ Dispute</span>
              )}

              {order.buyerInfo?.buyerMarkedCompleted && (
                <span className="opm-badge-complete">✓ Completed</span>
              )}

              {expandedOrderId === order.id ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}