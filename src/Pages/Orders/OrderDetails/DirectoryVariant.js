import React, { useEffect, useState } from "react";
import "./DirectoryVariant.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { doc, getDoc } from "firebase/firestore";
import checkPrice from "../../../Components/Functions/checkPrice";
import useSetOrderStatus from "../../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../../Components/Orders/OrderStatusTimeline";

export default function DirectoryVariant({ orderId }) {
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

        // Fetch order
        const orderRef = doc(db, "Orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setOrder({ id: orderSnap.id, ...orderData });

          // Fetch seller username
          if (orderData.sellerInfo?.sellerId) {
            const userRef = doc(db, "Users", orderData.sellerInfo.sellerId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setSellerName(userSnap.data().username || "N/A");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching directory order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <div className="od-order-details-panel">Loading order...</div>;

  // Convert Firestore timestamp to MM/DD/YYYY
  const date = order.orderCreated?.seconds
    ? new Date(order.orderCreated.seconds * 1000).toLocaleDateString("en-US")
    : "N/A";

  const type = order.type || "N/A";
  const orderID = order.id || "N/A";

  const delivery = order.deliveryInfo &&
                 (order.deliveryInfo.deliveryStreetAddress ||
                  order.deliveryInfo.deliveryCity ||
                  order.deliveryInfo.deliveryState ||
                  order.deliveryInfo.deliveryZipCode)
    ? `${order.deliveryInfo.deliveryStreetAddress || ""}${
        order.deliveryInfo.deliveryStreetAddress ? ", " : ""
      }${order.deliveryInfo.deliveryCity || ""}${
        order.deliveryInfo.deliveryCity ? " " : ""
      }${order.deliveryInfo.deliveryState || ""}${
        order.deliveryInfo.deliveryState ? " " : ""
      }${order.deliveryInfo.deliveryZipCode || ""}`
    : "N/A";

  const image = order.postData?.images?.[0] || "";
  const postId = order.postData?.postId || "N/A";
  const title = order.postData?.title || "N/A";
  const description = order.postData?.description || "N/A";
  const rawPrice = order?.price;
  const price = checkPrice(rawPrice);
  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);

  const paymentMethod = order.paymentInfo?.paymentmethod || "N/A";
  const lastFour = order.paymentInfo?.lastfour || "N/A";

  return (
    <div className="od-order-details-panel">
      <h2 className="od-panel-title">ORDER INFORMATION</h2>

      {/* Order Details */}
      <section className="od-section">
        <h3>Order Details</h3>
        <div className="od-order-info">
          <div><strong>Date</strong><p>{date}</p></div>
          <div><strong>Type</strong><p>{type}</p></div>
          <div><strong>Order ID</strong><p>{orderID}</p></div>
        </div>
        <div>
          <strong>Service Address</strong>
          <p>{delivery}</p>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="od-section">
        <h3>Ordered Items</h3>
        <div className="od-item-card">
          {image && <img src={image} alt="Product" />}
          <div>
            <div><strong>Title</strong><p>{title}</p></div>
            <div><strong>Description</strong><p>{description}</p></div>
            <button
              className="od-btn-view"
              onClick={() => (window.location.href = `/directorypost/${postId}`)}
            >
              View Post
            </button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="od-section">
        <h3>Payment Information</h3>
        <div className="od-payment-info">
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
      <section className="od-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>{sellerName}</p></div>
        <button className="od-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="od-section">
        <h3>Status</h3>
        <OrderStatusTimeline
          postId={orderId}
          orderSide="buyer"
        />
        
        <div className="od-status-buttons">
          {!order.buyerInfo?.buyerMarkedCompleted &&
          !order.buyerInfo?.buyerDispute &&
          !order.sellerInfo?.sellerDispute && (
            <button
              className="od-btn-complete"
              onClick={handleMarkCompleted}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>
          )}

          {order.buyerInfo?.buyerMarkedCompleted && (
            <button className="od-btn-completed" disabled>
              ✓ Marked Completed
            </button>
          )}

          {!order.buyerInfo?.buyerDispute &&
          !order.buyerInfo?.buyerMarkedCompleted && (
            <button
              className="od-btn-dispute"
              onClick={handleDispute}
              disabled={loading}
            >
              {loading ? "Processing..." : "Dispute"}
            </button>
          )}

          {order.buyerInfo?.buyerDispute && (
            <button className="od-btn-disputed" disabled>
              ⚠ Disputed Order
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
