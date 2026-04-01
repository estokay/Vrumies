import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useSetOrderStatus from "../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../Components/Orders/OrderStatusTimeline";
import checkPrice from "../../Functions/checkPrice";
import "./OrderDetailView.css";
import useGetUsername from "../../Hooks/useGetUsername";

export default function OrderDetailView({ order, onBack }) {
  const navigate = useNavigate();
  const { setOrderStatus, loading } = useSetOrderStatus();
  const buyerUsername = useGetUsername(order.buyerInfo?.buyerId);
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");

  useEffect(() => {
    if (!order) return;

    // Correctly target the field based on variant logic
    const logistics =
      order.type === "market"
        ? order.marketSpecific
        : order.trucksSpecific;

    setCarrier(logistics?.Carrier || "");
    setTracking(logistics?.trackingNumber || "");
  }, [order]);

  const handleAction = async (type) => {
    const payload = { orderId: order.id };
    if (type === "complete") payload.sellerPressedCompleted = true;
    if (type === "dispute") payload.sellerPressedDispute = true;

    const res = await setOrderStatus(payload);
    if (res?.success) window.location.reload();
  };

  const updateTracking = async () => {
    try {
      const ref = doc(db, "Orders", order.id);
      const field = order.type === "market" ? "marketSpecific" : "trucksSpecific";

      await updateDoc(ref, {
        [`${field}.Carrier`]: carrier,
        [`${field}.trackingNumber`]: tracking,
      });
      alert("Tracking updated");
    } catch {
      alert("Error updating tracking");
    }
  };

  if (!order) return <div className="od-loader">Loading...</div>;

  const price = checkPrice(order.price);
  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);

  // Determine Navigation Path based on type
  const getViewPath = () => {
    const postId = order.postData?.postId;
    if (!postId) return null;
    if (order.type === "market") return `/marketpost/${postId}`;
    if (order.type === "trucks") return `/truckpost/${postId}`;
    if (order.type === "offer") return `/eventpost/${postId}`;
    return `/directorypost/${postId}`;
  };

  return (
    <div className="od-container">
      <div className="od-nav">
        <button onClick={onBack} className="od-back">
          <FaArrowLeft /> Back
        </button>
        <span className="od-id-badge">ID: {order.id}</span>
      </div>

      <div className="od-section">
        <h2 className="od-title">{order.postData?.title}</h2>
        <div className="od-item-card">
          <img 
            src={order.postData?.images?.[0] || "https://via.placeholder.com/150"} 
            alt="" 
            className="od-image"
          />
          <div className="od-summary">
            <p><strong>Date:</strong> {order.orderCreated?.toDate?.().toLocaleDateString() || "N/A"}</p>
            <p><strong>Type:</strong> <span className="od-type-tag">{order.type?.toUpperCase()}</span></p>
            <p><strong>Buyer:</strong> {buyerUsername || "N/A"}</p>
            <p><strong>Description:</strong> {order.postData?.description || "N/A"}</p>
            {getViewPath() && (
              <button className="od-btn-view" onClick={() => navigate(getViewPath())}>
                View Original Post
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Type Specific Logistics: MARKET */}
      {order.type === "market" && (
        <div className="od-section">
          <h3>Shipping & Tracking</h3>
          <div className="od-data-row">
            <strong>Shipping Address:</strong>
            <p>{`${order.deliveryInfo?.deliveryStreetAddress || ""} ${order.deliveryInfo?.deliveryCity || ""} ${order.deliveryInfo?.deliveryState || ""} ${order.deliveryInfo?.deliveryZipCode || ""}`}</p>
          </div>
          <div className="od-tracking-input">
            <input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Carrier (e.g. FEDEX)" />
            <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking #" />
            <button onClick={updateTracking}>Save Tracking</button>
          </div>
        </div>
      )}

      {/* Type Specific Logistics: TRUCKS */}
      {order.type === "trucks" && (
        <div className="od-section">
          <h3>Freight Logistics</h3>
          <div className="od-grid">
            <div><strong>Pickup:</strong><p>{order.trucksSpecific?.pickupAddress || "N/A"}</p></div>
            <div><strong>Drop-off:</strong><p>{order.trucksSpecific?.dropoffAddress || "N/A"}</p></div>
            <div><strong>Weight:</strong><p>{order.trucksSpecific?.loadWeight} lbs</p></div>
            <div><strong>Length:</strong><p>{order.trucksSpecific?.loadLength} ft</p></div>
            <div><strong>Distance:</strong><p>{order.trucksSpecific?.distance} miles</p></div>
            <div><strong>RPM:</strong><p>${order.trucksSpecific?.rpm?.toFixed(2)}</p></div>
          </div>
        </div>
      )}

      {/* Type Specific Logistics: DIRECTORY / OFFER */}
      {(order.type === "directory" || order.type === "offer") && (
        <div className="od-section">
          <h3>Service Details</h3>
          <div className="od-data-row">
            <strong>Service Address:</strong>
            <p>{order.deliveryInfo ? `${order.deliveryInfo.deliveryStreetAddress || ""} ${order.deliveryInfo.deliveryCity || ""} ${order.deliveryInfo.deliveryState || ""} ${order.deliveryInfo.deliveryZipCode || ""}` : "N/A"}</p>
          </div>
        </div>
      )}

      <div className="od-section">
        <h3>Payment & Status</h3>
        <div className="od-payment-summary">
          <p>Subtotal: ${price.toFixed(2)}</p>
          <p>Fee (15%): ${transactionFee}</p>
          <p className="od-total">Total: ${total}</p>
        </div>
        
        <OrderStatusTimeline postId={order.id} orderSide="seller" />

        <div className="od-actions">
          {!order.sellerInfo?.sellerMarkedCompleted && (
            <button className="od-btn-complete" onClick={() => handleAction("complete")} disabled={loading}>
              Complete Order
            </button>
          )}
          {!order.sellerInfo?.sellerDispute && (
            <button className="od-btn-dispute" onClick={() => handleAction("dispute")} disabled={loading}>
              Dispute
            </button>
          )}
        </div>
      </div>
    </div>
  );
}