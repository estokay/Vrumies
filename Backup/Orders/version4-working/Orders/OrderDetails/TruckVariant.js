import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase"; // adjust path if needed
import "./TruckVariant.css";
import checkPrice from "../../../Functions/checkPrice";
import useSetOrderStatus from "../../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../../Components/Orders/OrderStatusTimeline";

export default function TruckVariant({ orderId }) {
  const [order, setOrder] = useState(null);
  const [sellerName, setSellerName] = useState("N/A");
  const { setOrderStatus, loading } = useSetOrderStatus();

    const handleMarkCompleted = async () => {
    console.log("Sending payload:", {
      orderId,
      buyerPressedCompleted: true,
    });

    const result = await setOrderStatus({
      orderId,
      buyerPressedCompleted: true,
    });

    console.log("Function result:", result);

    if (result?.success) {
      setOrder((prev) => ({
        ...prev,
        buyerInfo: {
          ...prev.buyerInfo,
          buyerMarkedCompleted: true,
        },
      }));
    }
  };

  const handleDispute = async () => {
    const result = await setOrderStatus({
      orderId,
      buyerPressedDispute: true,
    });

    if (result?.success) {
      setOrder((prev) => ({
        ...prev,
        buyerInfo: {
          ...prev.buyerInfo,
          buyerDispute: true,
        },
      }));
    }
  };

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

  const pickupAddress = order.trucksSpecific?.pickupAddress || "N/A";
  const dropOffAddress = order.trucksSpecific?.dropoffAddress || "N/A";

  const distance = order.trucksSpecific?.distance || "N/A";
  const rpm = order.trucksSpecific?.rpm || "N/A";

  const loadWeight = order.trucksSpecific?.loadWeight || "N/A";
  const loadLength = order.trucksSpecific?.loadLength || "N/A";

  const image = order.postData?.images?.[0] || "";
  const postId = order.postData?.postId || "N/A";
  const title = order.postData?.title || "N/A";
  const description = order.postData?.description || "N/A";
  const rawPrice = order?.price;
  const price = checkPrice(rawPrice);
  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);

  const paymentMethod = order.paymentInfo?.paymentMethod || "N/A";
  const lastFour = order.paymentInfo?.lastFour || "N/A";

  return (
    <div className="tv-custom-panel">
      <h2 className="tv-custom-title">ORDER INFORMATION</h2>

      {/* Order Details */}
      <section className="tv-custom-section">
        <h3>Order Details</h3>
        <div className="tv-custom-info">
          <div><strong>Date</strong><p>{date}</p></div>
          <div><strong>Type</strong><p>{type}</p></div>
          <div><strong>Order ID</strong><p>{id}</p></div>
        </div>
        <div>
          <strong>Pickup Address</strong>
          <p>{pickupAddress}</p>
        </div>
        <div>
          <strong>Drop-Off Address</strong>
          <p>{dropOffAddress}</p>
        </div>

        {/* Carrier + Tracking */}
        <div className="tv-custom-tracking-display">
          <div>
            <strong>Load Weight</strong>
            <p>{loadWeight} lbs</p>
          </div>
          <div>
            <strong>Load Length</strong>
            <p>{loadLength} ft</p>
          </div>
          <div>
            <strong>Distance</strong>
            <p>{distance} miles</p>
          </div>
          <div>
            <strong>Rate Per Mile</strong>
            <p>${rpm.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="tv-custom-section">
        <h3>Ordered Items</h3>
        <div className="tv-custom-item">
          {image && <img src={image} alt="Product" />}
          <div>
            <div><strong>Title</strong><p>{title}</p></div>
            <div><strong>Description</strong><p>{description}</p></div>
            <button
              className="tv-custom-btn-view"
              onClick={() => (window.location.href = `/truckpost/${postId}`)}
            >
              View Post
            </button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="tv-custom-section">
        <h3>Payment Information</h3>
        <div className="tv-custom-payment">
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
      <section className="tv-custom-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>{sellerName}</p></div>
        <button className="tv-custom-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="tv-custom-section">
        <h3>Status</h3>
        <OrderStatusTimeline
          postId={orderId}
          orderSide="buyer"
        />

        <div className="tv-custom-status-buttons">
          {!order.buyerInfo?.buyerMarkedCompleted &&
          !order.buyerInfo?.buyerDispute &&
          !order.sellerInfo?.sellerDispute && (
            <button
              className="tv-custom-btn-complete"
              onClick={handleMarkCompleted}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>
          )}

          {order.buyerInfo?.buyerMarkedCompleted && (
            <button className="tv-custom-btn-completed" disabled>
              ✓ Marked Completed
            </button>
          )}

          {!order.buyerInfo?.buyerDispute &&
          !order.buyerInfo?.buyerMarkedCompleted && (
            <button
              className="tv-custom-btn-dispute"
              onClick={handleDispute}
              disabled={loading}
            >
              {loading ? "Processing..." : "Dispute"}
            </button>
          )}

          {order.buyerInfo?.buyerDispute && (
            <button className="tv-custom-btn-disputed" disabled>
              ⚠ Disputed Order
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
