import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase";
import "./TruckOrderCard.css";

export default function TruckOrderCard({ orderId }) {
  const [order, setOrder] = useState({
    title: "N/A",
    date: "N/A",
    status: "in progress",
    type: "N/A",
  });

  useEffect(() => {
    async function fetchOrder() {
      try {
        const ref = doc(db, "Orders", orderId);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;

        const data = snap.data();

        const type = data?.type || "N/A";
        const title = data?.postData?.title || "N/A";
        const date = data?.orderCreated?.toDate
          ? data.orderCreated.toDate().toLocaleDateString()
          : "N/A";

        // Status logic
        const buyerDispute = data?.buyerInfo?.buyerDispute === true;
        const sellerDispute = data?.sellerInfo?.sellerDispute === true;
        const buyerCompleted = data?.buyerInfo?.buyerMarkedCompleted === true;
        const sellerCompleted = data?.sellerInfo?.sellerMarkedCompleted === true;

        let status = "in progress";
        if (buyerDispute || sellerDispute) {
          status = "dispute";
        } else if (!buyerDispute && !sellerDispute && buyerCompleted && sellerCompleted) {
          status = "completed";
        }

        setOrder({ title, date, status, type });
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    }

    fetchOrder();
  }, [orderId]);

  return (
    <>
      <div className="truck-card-title">{order.title}</div>
      <div className="truck-card-bottom">
        <span className="truck-card-type">{order.type}</span>
        <span className="truck-card-date">{order.date}</span>
        <span className={`truck-card-status status-${order.status.replace(" ", "-")}`}>
          {order.status}
        </span>
      </div>
    </>
  );
}
