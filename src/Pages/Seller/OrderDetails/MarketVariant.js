import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import "./MarketVariant.css";

export default function MarketVariant({ orderId }) {
  const [order, setOrder] = useState(null);
  const [buyerName, setBuyerName] = useState("N/A");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
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

          // preload carrier/tracking if present
          setCarrier(data.marketSpecific?.Carrier || "");
          setTrackingNumber(data.marketSpecific?.trackingNumber || "");

          // fetch buyer username
          if (data.buyerInfo?.buyerId) {
            const buyerRef = doc(db, "Users", data.buyerInfo.buyerId);
            const buyerSnap = await getDoc(buyerRef);
            if (buyerSnap.exists()) {
              setBuyerName(buyerSnap.data().username || "N/A");
            }
          }
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setOrder(null);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handleSave = async () => {
    if (!orderId) return;
    try {
      const orderRef = doc(db, "Orders", orderId);
      await updateDoc(orderRef, {
        "marketSpecific.Carrier": carrier,
        "marketSpecific.trackingNumber": trackingNumber,
      });
      alert("Tracking info saved!");
    } catch (err) {
      console.error("Error saving tracking info:", err);
    }
  };

  const handleClear = () => {
    setCarrier("");
    setTrackingNumber("");
  };

  if (!order) {
    return <div className="sm-panel">Loading order...</div>;
  }

  // Extract mapped values with fallbacks
  const date = order.orderCreated?.seconds
    ? new Date(order.orderCreated.seconds * 1000).toLocaleDateString()
    : "N/A";
  const type = order.type || "N/A";
  const id = order.id || "N/A"; // ✅ Now correctly shows document ID
  const shippingAddress = order.deliveryInfo
    ? `${order.deliveryInfo.deliveryStreetAddress || ""} ${order.deliveryInfo.deliveryCity || ""} ${order.deliveryInfo.deliveryState || ""} ${order.deliveryInfo.deliveryZipCode || ""}`
    : "N/A";

  const image = order.postData?.images?.[0] || "";
  const title = order.postData?.title || "N/A";
  const description = order.postData?.description || "N/A";
  const priceStr = order.postData?.price?.replace("$", "") || "0";
  const price = parseFloat(priceStr) || 0;
  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);

  const paymentMethod = order.paymentInfo?.paymentmethod || "N/A";
  const lastFour = order.paymentInfo?.lastfour || "N/A";
  const postId = order.postData?.postId || "";

  // Status logic
  const buyerCompleted = order.buyerInfo?.buyerMarkedCompleted || false;
  const buyerDispute = order.buyerInfo?.buyerDispute || false;
  const sellerDispute = order.sellerInfo?.sellerDispute || false;

  let statusSteps = [
    { label: "Order Started", active: true },
    { label: "Marked Completed by Buyer", active: buyerCompleted },
    { label: "Completed", active: buyerCompleted }, // mark same as buyer for now
  ];

  if (buyerDispute || sellerDispute) {
    statusSteps.push({ label: "Dispute", active: true });
  }

  return (
    <div className="sm-panel">
      <h2 className="sm-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="sm-section">
        <h3>Order Details</h3>
        <div className="sm-info">
          <div><strong>Date</strong><p>{date}</p></div>
          <div><strong>Type</strong><p>{type}</p></div>
          <div><strong>Order ID</strong><p>{id}</p></div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <p>{shippingAddress}</p>
        </div>

        {/* Carrier + Tracking Fields */}
        <div className="sm-tracking-fields">
          <div>
            <strong>Carrier</strong>
            <input
              type="text"
              placeholder="Enter Carrier (e.g., FEDEX)"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
            />
          </div>
          <div>
            <strong>Tracking Number</strong>
            <input
              type="text"
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons for both inputs */}
        <div className="sm-tracking-btn-wrapper">
          <button className="sm-btn-save" onClick={handleSave}>Save</button>
          <button className="sm-btn-clear" onClick={handleClear}>Clear</button>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="sm-section">
        <h3>Ordered Items</h3>
        <div className="sm-item">
          {image && <img src={image} alt="Product" />}
          <div>
            <div><strong>Title</strong><p>{title}</p></div>
            <div><strong>Description</strong><p>{description}</p></div>
            {postId && (
              <button
                className="sm-btn-view"
                onClick={() => navigate(`/marketpost/${postId}`)}
              >
                View Post
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="sm-section">
        <h3>Payment Information</h3>
        <div className="sm-payment">
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
      <section className="sm-section">
        <h3>Buyer Information</h3>
        <div><strong>Buyer</strong><p>{buyerName}</p></div>
        <button className="sm-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="sm-section">
        <h3>Status</h3>
        <div className="sm-timeline-wrapper">
          {statusSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="sm-timeline-step">
                <div className={`sm-circle ${step.active ? "active" : ""}`}>
                  {step.active && <FaCheck />}
                </div>
                <p className={`sm-timeline-label ${step.active ? "active-label" : ""}`}>
                  {step.label}
                </p>
              </div>
              {idx < statusSteps.length - 1 && <div className="sm-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>

        <div className="sm-status-buttons">
          <button className="sm-btn-complete">Mark as Completed</button>
          <button className="sm-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
