import React, { useEffect, useState, useRef } from "react";
import "./OfferVariant.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import checkPrice from "../../../Components/Functions/checkPrice";
import useSetOrderStatus from "../../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../../Components/Orders/OrderStatusTimeline";

export default function OfferVariant({ orderId }) {
  const [order, setOrder] = useState(null);
  const [buyerName, setBuyerName] = useState("N/A");
  const { setOrderStatus, loading } = useSetOrderStatus();
  
  const navigate = useNavigate();

  const handleMarkCompleted = async () => {
    console.log("Sending payload:", {
      orderId,
      sellerPressedCompleted: true,
    });

    const result = await setOrderStatus({
      orderId,
      sellerPressedCompleted: true,
    });

    console.log("Function result:", result);

    if (result?.success) {
      setOrder((prev) => ({
        ...prev,
        sellerInfo: {
          ...prev.sellerInfo,
          sellerMarkedCompleted: true,
        },
      }));
    }
  };

  const handleDispute = async () => {
    const result = await setOrderStatus({
      orderId,
      sellerPressedDispute: true,
    });

    if (result?.success) {
      setOrder((prev) => ({
        ...prev,
        sellerInfo: {
          ...prev.sellerInfo,
          sellerDispute: true,
        },
      }));
    }
  };

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
        <OrderStatusTimeline
          postId={orderId}
          orderSide="seller"
        />

        <div className="seller-status-buttons">
          {!order.sellerInfo?.sellerMarkedCompleted &&
          !order.sellerInfo?.sellerDispute &&
          !order.buyerInfo?.buyerDispute && (
            <button
              className="seller-btn-complete"
              onClick={handleMarkCompleted}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>
          )}

          {order.sellerInfo?.sellerMarkedCompleted && (
            <button className="seller-btn-completed" disabled>
              ✓ Marked Completed
            </button>
          )}

          {!order.sellerInfo?.sellerDispute &&
          !order.sellerInfo?.sellerMarkedCompleted && (
            <button
              className="seller-btn-dispute"
              onClick={handleDispute}
              disabled={loading}
            >
              {loading ? "Processing..." : "Dispute"}
            </button>
          )}

          {order.sellerInfo?.sellerDispute && (
            <button className="seller-btn-disputed" disabled>
              ⚠ Disputed Order
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
