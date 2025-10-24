import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase"; // adjust path if needed
import "./MarketVariant.css";

export default function MarketVariant({ orderId }) {
  const [order, setOrder] = useState(null);
  const [sellerName, setSellerName] = useState("N/A");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) return;
        const orderRef = doc(db, "Orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setOrder({ id: orderSnap.id, ...orderData });

          // Fetch seller username
          if (orderData?.sellerInfo?.sellerId) {
            const userRef = doc(db, "Users", orderData.sellerInfo.sellerId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setSellerName(userSnap.data().username || "N/A");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading order...</p>;

  // Map values with fallbacks
  const date = order.orderCreated?.seconds
    ? new Date(order.orderCreated.seconds * 1000).toLocaleDateString()
    : "N/A";

  const type = order.type || "N/A";
  const id = order.id || "N/A";

  const delivery = order.deliveryInfo
    ? `${order.deliveryInfo.deliveryStreetAddress || ""}, ${order.deliveryInfo.deliveryCity || ""} ${order.deliveryInfo.deliveryState || ""} ${order.deliveryInfo.deliveryZipCode || ""}`
    : "N/A";

  const carrier = order.marketSpecific?.Carrier || "N/A";
  const trackingNumber = order.marketSpecific?.trackingNumber || "N/A";

  const image = order.postData?.images?.[0] || "";
  const postId = order.postData?.postId || "N/A";
  const title = order.postData?.title || "N/A";
  const description = order.postData?.description || "N/A";
  const priceStr = order.postData?.price?.replace(/[^0-9.]/g, "") || "0";
  const price = parseFloat(priceStr) || 0;

  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);

  const paymentMethod = order.paymentInfo?.paymentmethod || "N/A";
  const lastFour = order.paymentInfo?.lastfour || "N/A";

  // Status logic
  let statusSteps = [
    { label: "Order Started", active: true },
    { label: "Marked Completed by Seller", active: order.sellerInfo?.sellerMarkedCompleted || false },
    { label: "Completed", active: false },
  ];

  if (order.buyerInfo?.buyerDispute || order.sellerInfo?.sellerDispute) {
    statusSteps = [
      { label: "Order Started", active: true },
      { label: "Dispute", active: true },
    ];
  }

  return (
    <div className="mv-custom-panel">
      <h2 className="mv-custom-title">ORDER INFORMATION</h2>

      {/* Order Details */}
      <section className="mv-custom-section">
        <h3>Order Details</h3>
        <div className="mv-custom-info">
          <div><strong>Date</strong><p>{date}</p></div>
          <div><strong>Type</strong><p>{type}</p></div>
          <div><strong>Order ID</strong><p>{id}</p></div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <p>{delivery}</p>
        </div>

        {/* Carrier + Tracking */}
        <div className="mv-custom-tracking-display">
          <div>
            <strong>Carrier</strong>
            <p>{carrier}</p>
          </div>
          <div>
            <strong>Tracking Number</strong>
            <p>{trackingNumber}</p>
          </div>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="mv-custom-section">
        <h3>Ordered Items</h3>
        <div className="mv-custom-item">
          {image && <img src={image} alt="Product" />}
          <div>
            <div><strong>Title</strong><p>{title}</p></div>
            <div><strong>Description</strong><p>{description}</p></div>
            <button
              className="mv-custom-btn-view"
              onClick={() => (window.location.href = `/marketpost/${postId}`)}
            >
              View Post
            </button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="mv-custom-section">
        <h3>Payment Information</h3>
        <div className="mv-custom-payment">
          <div>
            <strong>Price</strong><p>${price.toFixed(2)}</p>
            <strong>Transaction Fee (15%)</strong><p>${transactionFee}</p>
            <strong>Total</strong><p>${total}</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>{paymentMethod}</p>
            <strong>Last 4 digits of Card</strong><p>{lastFour}</p>
          </div>
        </div>
      </section>

      {/* Seller Information */}
      <section className="mv-custom-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>{sellerName}</p></div>
        <button className="mv-custom-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="mv-custom-section">
        <h3>Status</h3>
        <div className="mv-custom-timeline-wrapper">
          {statusSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="mv-custom-timeline-step">
                <div className={`mv-custom-circle ${step.active ? "active" : ""}`}>
                  {step.active && <FaCheck />}
                </div>
                <p className={`mv-custom-timeline-label ${step.active ? "active-label" : ""}`}>
                  {step.label}
                </p>
              </div>
              {idx < statusSteps.length - 1 && <div className="mv-custom-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>

        <div className="mv-custom-status-buttons">
          <button className="mv-custom-btn-complete">Mark as Completed</button>
          <button className="mv-custom-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
