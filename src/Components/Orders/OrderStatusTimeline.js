import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./OrderStatusTimeline.css";

export default function OrderStatusTimeline({ postId, orderSide }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const orderRef = doc(db, "Orders", postId);

    // 🔥 Realtime listener
    const unsubscribe = onSnapshot(
      orderRef,
      (snap) => {
        if (snap.exists()) {
          setOrder(snap.data());
        } else {
          setOrder(null);
        }
      },
      (error) => {
        console.error("Error listening to order:", error);
      }
    );

    // ✅ cleanup listener on unmount
    return () => unsubscribe();
  }, [postId]);

  if (!order) return <p>Loading status...</p>;

  const buyerCompleted = order.buyerInfo?.buyerMarkedCompleted || false;
  const sellerCompleted = order.sellerInfo?.sellerMarkedCompleted || false;
  const buyerDispute = order.buyerInfo?.buyerDispute || false;
  const sellerDispute = order.sellerInfo?.sellerDispute || false;

  const disputeActive = buyerDispute || sellerDispute;
  const completedActive = buyerCompleted && sellerCompleted;

  const markedCompletedLabel =
    orderSide === "buyer"
      ? "Marked Completed by Seller"
      : "Marked Completed by Buyer";

  const markedCompletedActive =
    orderSide === "buyer" ? sellerCompleted : buyerCompleted;

  const steps = [
    { label: "Order Started", active: true },
    { label: markedCompletedLabel, active: markedCompletedActive },
    { label: "Completed", active: completedActive },
  ];

  return (
    <div className="ost-wrapper">

      {/* Main timeline */}
      <div className="ost-main">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="ost-step">
              <div className={`ost-circle ${step.active ? "active" : ""}`}>
                {step.active && <FaCheck />}
              </div>
              <p className={`ost-label ${step.active ? "active-label" : ""}`}>
                {step.label}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="ost-arrow">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Separate Dispute */}
      <div className="ost-dispute-section">
        <div
          className={`ost-circle dispute ${
            disputeActive ? "active-dispute" : ""
          }`}
        >
          {disputeActive && <FaTimes />}
        </div>
        <p
          className={`ost-label dispute-label ${
            disputeActive ? "active-dispute-label" : ""
          }`}
        >
          Dispute
        </p>
      </div>
    </div>
  );
}