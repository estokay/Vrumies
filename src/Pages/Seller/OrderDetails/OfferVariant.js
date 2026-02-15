import React, { useEffect, useState, useRef } from "react";
import "./OfferVariant.css";
import { FaFilePdf, FaCheck } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import checkPrice from "../../../Components/Functions/checkPrice";

export default function OfferVariant({ orderId }) {
  const [order, setOrder] = useState(null);
  const [buyerName, setBuyerName] = useState("N/A");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "Orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();

          // ✅ Include document ID
          setOrder({
            ...data,
            id: orderSnap.id,
          });

          

          // fetch buyer username
          if (data.buyerInfo?.buyerId) {
            const buyerRef = doc(db, "Users", data.buyerInfo.buyerId);
            const buyerSnap = await getDoc(buyerRef);
            if (buyerSnap.exists()) {
              setBuyerName(buyerSnap.data().username || "N/A");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching event order:", err);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  

  

    
  

  

  if (!order) return <div className="seller-event-details-panel">Loading order...</div>;

  // Extract mapped values
  const date = order.orderCreated?.seconds
    ? new Date(order.orderCreated.seconds * 1000).toLocaleDateString()
    : "N/A";
  const type = order.type || "N/A";
  const id = order.id || "N/A"; // ✅ Now includes document ID
  const image = order.postData?.images?.[0] || "";
  const title = order.postData?.title || "N/A";
  const description = order.postData?.description || "N/A";
  const rawPrice = order?.price;
  const price = checkPrice(rawPrice);
  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);
  const paymentMethod = order.paymentInfo?.paymentMethod || "N/A";
  const lastFour = order.paymentInfo?.lastFour || "N/A";
  const postId = order.postData?.postId || "";

  // Status logic
  const buyerCompleted = order.buyerInfo?.buyerMarkedCompleted || false;
  const buyerDispute = order.buyerInfo?.buyerDispute || false;
  const sellerDispute = order.sellerInfo?.sellerDispute || false;

  let statusSteps = [
    { label: "Order Started", active: true },
    { label: "Marked Completed by Buyer", active: buyerCompleted },
    { label: "Completed", active: buyerCompleted },
  ];
  if (buyerDispute || sellerDispute) {
    statusSteps.push({ label: "Dispute", active: true });
  }

  return (
    <div className="seller-event-details-panel">
      <h2 className="seller-panel-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="seller-section">
        <h3>Order Details</h3>
        <div className="seller-order-info">
          <div><strong>Date</strong><p>{date}</p></div>
          <div><strong>Type</strong><p>{type}</p></div>
          <div><strong>Order ID</strong><p>{id}</p></div>
        </div>

        
      </section>

      {/* Ordered Items */}
      <section className="seller-section">
        <h3>Ordered Items</h3>
        <div className="seller-item-card">
          {image && <img src={image} alt="Event" />}
          <div>
            <div><strong>Title</strong><p>{title}</p></div>
            <div><strong>Description</strong><p>{description}</p></div>
            {postId && (
              <button
                className="seller-btn-view"
                onClick={() => navigate(`/eventpost/${postId}`)}
              >
                View Post
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="seller-section">
        <h3>Payment Information</h3>
        <div className="seller-payment-info">
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

      {/* Buyer Information */}
      <section className="seller-section">
        <h3>Buyer Information</h3>
        <div><strong>Buyer</strong><p>{buyerName}</p></div>
        <button className="seller-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="seller-section">
        <h3>Status</h3>
        <div className="seller-timeline-wrapper">
          {statusSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="seller-timeline-step">
                <div className={`seller-circle ${step.active ? "active" : ""}`}>
                  {step.active && <FaCheck />}
                </div>
                <p className={`seller-timeline-label ${step.active ? "seller-active-label" : ""}`}>
                  {step.label}
                </p>
              </div>
              {idx < statusSteps.length - 1 && <div className="seller-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>

        <div className="seller-status-buttons">
          <button className="seller-btn-complete">Mark as Completed</button>
          <button className="seller-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
