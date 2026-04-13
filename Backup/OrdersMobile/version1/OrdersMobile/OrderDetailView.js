import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { FaArrowLeft } from "react-icons/fa";
import useSetOrderStatus from "../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../Components/Orders/OrderStatusTimeline";
import checkPrice from "../../Functions/checkPrice";
import "./OrderDetailView.css";

export default function OrderDetailView({ order, onBack }) {
  const [sellerName, setSellerName] = useState("N/A");
  const { setOrderStatus, loading } = useSetOrderStatus();

  useEffect(() => {
    const fetchSeller = async () => {
      if (!order?.sellerInfo?.sellerId) return;
      const snap = await getDoc(doc(db, "Users", order.sellerInfo.sellerId));
      if (snap.exists()) setSellerName(snap.data().username || "N/A");
    };
    fetchSeller();
  }, [order]);

  const handleAction = async (type) => {
    const payload = { orderId: order.id };
    if (type === "complete") payload.buyerPressedCompleted = true;
    if (type === "dispute") payload.buyerPressedDispute = true;
    await setOrderStatus(payload);
  };

  const price = checkPrice(order.price || 0);
  const fee = (price * 0.15).toFixed(2);
  const total = (parseFloat(price) + parseFloat(fee)).toFixed(2);

  return (
    <div className="bd-container">
      <nav className="bd-nav">
        <button onClick={onBack} className="bd-back"><FaArrowLeft /> Back</button>
        <div className="bd-id-badge">ID: {order.id.slice(0, 8)}</div>
      </nav>

      <section className="bd-section">
        <h3>Order Details</h3>
        <div className="bd-item-card">
          {order.postData?.images?.[0] && <img src={order.postData.images[0]} alt="Product" className="bd-image" />}
          <div>
            <strong>{order.postData?.title}</strong>
            <p>{order.postData?.description}</p>
          </div>
        </div>
      </section>

      <section className="bd-section">
        <h3>Seller Info</h3>
        <div className="bd-data-row">
          <span>Username:</span> <strong>{sellerName}</strong>
        </div>
      </section>

      <section className="bd-section">
        <h3>Payment & Status</h3>
        <div className="bd-payment-summary">
          <p>Price: ${price.toFixed(2)}</p>
          <p>Fee: ${fee}</p>
          <p className="bd-total">Total: ${total}</p>
        </div>
        
        <OrderStatusTimeline postId={order.id} orderSide="buyer" />

        <div className="bd-actions">
          {!order.buyerInfo?.buyerMarkedCompleted && (
            <button className="bd-btn-complete" onClick={() => handleAction("complete")} disabled={loading}>
              Mark Received
            </button>
          )}
          {!order.buyerInfo?.buyerDispute && (
            <button className="bd-btn-dispute" onClick={() => handleAction("dispute")} disabled={loading}>
              Open Dispute
            </button>
          )}
        </div>
      </section>
    </div>
  );
}