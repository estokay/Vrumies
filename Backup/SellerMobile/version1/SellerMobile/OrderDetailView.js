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

export default function OrderDetailView({ order: initialOrder, onBack }) {
  const [order, setOrder] = useState(initialOrder);
  const navigate = useNavigate();
  const { setOrderStatus, loading } = useSetOrderStatus();

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const buyerUsername = useGetUsername(order?.buyerInfo?.buyerId);
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

    if (res?.success) {
      setOrder((prev) => ({
        ...prev,
        sellerInfo: {
          ...prev.sellerInfo,
          sellerMarkedCompleted:
            type === "complete"
              ? true
              : prev.sellerInfo?.sellerMarkedCompleted,
          sellerDispute:
            type === "dispute"
              ? true
              : prev.sellerInfo?.sellerDispute,
        },
      }));
    }
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

  const quoteImages = order.directorySpecific?.quoteImages || [];
  const vehicleInfo = order.directorySpecific?.vehicleInfo || {};
  const additionalInfo = order.directorySpecific?.additionalInfo || "N/A";

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

      {/* Post Information */}
      <div className="odm-section">
        <h3>Post Information</h3>
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
            <p><strong>Description:</strong> {order.postData?.description || "N/A"}</p>
            {/* DIRECTORY ONLY */}
            {order.type === "directory" && (
              <>
                <p>
                  <strong>Service Location:</strong>{" "}
                  {order.directorySpecific?.serviceLocation || "N/A"}
                </p>

                <p>
                  <strong>Service Address:</strong>{" "}
                  {order.deliveryInfo
                    ? (
                        `${order.deliveryInfo.deliveryStreetAddress || ""} ${
                          order.deliveryInfo.deliveryCity || ""
                        } ${order.deliveryInfo.deliveryState || ""} ${
                          order.deliveryInfo.deliveryZipCode || ""
                        }`.trim() || "N/A"
                      )
                    : "N/A"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quote Information */}
      {order.type === "directory" && (
        <div className="odm-section">
          <h3>Quote Information</h3>

          {/* Vehicle */}
          <div className="od-quote-vehicle">
            <strong>Vehicle</strong>

            <p>
              {vehicleInfo?.year || ""}{" "}
              {vehicleInfo?.make || ""}{" "}
              {vehicleInfo?.model || ""}{" "}
              {vehicleInfo?.trim || ""}
            </p>
          </div>

          {/* Additional Information */}
          <div className="od-quote-additional">
            <strong>Additional Information</strong>

            <p>{additionalInfo}</p>
          </div>

          {/* Quote Images */}
          {quoteImages.length > 0 && (
            <div className="od-quote-images">
              <strong>Quote Images</strong>

              <div className="od-quote-image-grid">
                {quoteImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`quote-${idx}`}
                    className="od-quote-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buyer Information */}
      <div className="odm-section">
        <h3>Buyer Information</h3>
        <div className="od-data-row">
          <span>Username:</span> <strong>{buyerUsername}</strong>
        </div>
      </div>

      {/* Type Specific Logistics: MARKET */}
      {order.type === "market" && (
        <div className="odm-section">
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
        <div className="odm-section">
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

      <div className="odm-section">
        <h3>Payment & Status</h3>
        <div className="od-payment-summary">
          <p>Subtotal: ${price.toFixed(2)}</p>
          <p>Fee (15%): ${transactionFee}</p>
          <p className="od-total">Total: ${total}</p>
        </div>
        
        <OrderStatusTimeline postId={order.id} orderSide="seller" />

        <div className="od-actions">
          {!order.sellerInfo?.sellerMarkedCompleted &&
          !order.sellerInfo?.sellerDispute &&
          !order.buyerInfo?.buyerDispute && (
            <button
              className="od-btn-complete"
              onClick={() => handleAction("complete")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>
          )}

          {order.sellerInfo?.sellerMarkedCompleted && (
            <button className="od-btn-completed" disabled>
              ✓ Marked Completed
            </button>
          )}

          {!order.sellerInfo?.sellerDispute &&
          !order.sellerInfo?.sellerMarkedCompleted && (
            <button
              className="od-btn-dispute"
              onClick={() => handleAction("dispute")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Dispute"}
            </button>
          )}

          {order.sellerInfo?.sellerDispute && (
            <button className="od-btn-disputed" disabled>
              ⚠ Disputed Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}