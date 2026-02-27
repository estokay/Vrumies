import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./DirectoryVariant.css";
import { useNavigate } from "react-router-dom";
import checkPrice from "../../../Functions/checkPrice";
import useSetOrderStatus from "../../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../../Components/Orders/OrderStatusTimeline";

export default function DirectoryVariant({ orderId }) {
  const [order, setOrder] = useState(null);
  const [buyerUsername, setBuyerUsername] = useState("N/A");
  const navigate = useNavigate(); // Added navigate
  const { setOrderStatus, loading } = useSetOrderStatus();

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

          // Fetch buyer username
          const buyerId = data.buyerInfo?.buyerId || data.buyerId;
          if (buyerId) {
            const buyerRef = doc(db, "Users", buyerId);
            const buyerSnap = await getDoc(buyerRef);
            if (buyerSnap.exists()) {
              setBuyerUsername(buyerSnap.data().username || "N/A");
            }
          }

          // Correctly parse date
          let date = "N/A";
          if (data?.orderCreated) {
            if (data.orderCreated.toDate) {
              date = data.orderCreated.toDate().toLocaleDateString();
            } else if (data.orderCreated.seconds) {
              date = new Date(data.orderCreated.seconds * 1000).toLocaleDateString();
            }
          }

          const rawPrice = order?.price;
          const price = checkPrice(rawPrice);

          setOrder({
            date,
            type: data.type || "N/A",
            id: orderSnap.id || "N/A",
            serviceAddress: data.deliveryInfo
              ? `${data.deliveryInfo.deliveryStreetAddress || ""} ${data.deliveryInfo.deliveryCity || ""} ${data.deliveryInfo.deliveryState || ""} ${data.deliveryInfo.deliveryZipCode || ""}`
              : "N/A",
            image: data.postData?.images?.[0] || null,
            title: data.postData?.title || "N/A",
            description: data.postData?.description || "N/A",
            price,
            postId: data.postData?.postId || "N/A",
            paymentMethod: data.paymentInfo?.paymentMethod || "N/A",
            lastFour: data.paymentInfo?.lastFour || "N/A",
            buyerInfo: {
              buyerMarkedCompleted: data.buyerInfo?.buyerMarkedCompleted || false,
              buyerDispute: data.buyerInfo?.buyerDispute || false,
            },
            sellerInfo: {
              sellerMarkedCompleted: data.sellerInfo?.sellerMarkedCompleted || false,
              sellerDispute: data.sellerInfo?.sellerDispute || false,
            },
          });
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

  if (!order) return <p>Loading order...</p>;

  const transactionFee = (order.price * 0.15).toFixed(2);
  const total = (order.price + parseFloat(transactionFee)).toFixed(2);

  return (
    <div className="seller-order-details-panel">
      <h2 className="seller-panel-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="seller-section">
        <h3>Order Details</h3>
        <div className="seller-order-info">
          <div><strong>Date</strong><p>{order.date}</p></div>
          <div><strong>Type</strong><p>{order.type}</p></div>
          <div><strong>Order ID</strong><p>{order.id}</p></div>
        </div>
        <div>
          <strong>Service Address</strong>
          <p>{order.serviceAddress}</p>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="seller-section">
        <h3>Ordered Items</h3>
        <div className="seller-item-card">
          {order.image && <img src={order.image} alt="Product" />}
          <div>
            <div><strong>Title</strong><p>{order.title}</p></div>
            <div><strong>Description</strong><p>{order.description}</p></div>
            {/* Changed Link to button */}
            {order.postId && (
              <button
                className="seller-btn-view"
                onClick={() => navigate(`/directorypost/${order.postId}`)}
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
            <strong>Price</strong><p>${order.price.toFixed(2)}</p>
            <strong>Transaction Fee (15%)</strong><p>${transactionFee}</p>
            <strong>Total</strong><p>${total}</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>{order.paymentMethod}</p>
            <strong>Last 4 digits of Card</strong><p>{order.lastFour}</p>
          </div>
        </div>
      </section>

      {/* Buyer Information */}
      <section className="seller-section">
        <h3>Buyer Information</h3>
        <div><strong>Buyer</strong><p>{buyerUsername}</p></div>
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
