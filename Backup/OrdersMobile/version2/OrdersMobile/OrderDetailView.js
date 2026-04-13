import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/firebase";
import useSetOrderStatus from "../../CloudFunctions/useSetOrderStatus";
import checkPrice from "../../Functions/checkPrice";
import OrderStatusTimeline from "../../Components/Orders/OrderStatusTimeline";
import "./OrderDetailView.css";

export default function OrderDetailView({ order }) {
  const [sellerName, setSellerName] = useState("N/A");
  const { setOrderStatus, loading: statusLoading } = useSetOrderStatus();

  useEffect(() => {
    const fetchSeller = async () => {
      if (!order?.sellerInfo?.sellerId) return;
      const userRef = doc(db, "Users", order.sellerInfo.sellerId);
      const snap = await getDoc(userRef);
      if (snap.exists()) setSellerName(snap.data().username || "N/A");
    };
    fetchSeller();
  }, [order]);

  const handleMarkCompleted = async () => {
    await setOrderStatus({
      orderId: order.id,
      buyerPressedCompleted: true,
    });
  };

  const handleDispute = async () => {
    await setOrderStatus({
      orderId: order.id,
      buyerPressedDispute: true,
    });
  };

  const price = checkPrice(order.price || 0);
  const fee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(fee)).toFixed(2);

  return (
    <div className="opm-detail-panel">
      {/* Info */}
      <div className="opm-info">
        <div><strong>Date</strong><p>{new Date(order.orderCreated?.seconds * 1000).toLocaleDateString()}</p></div>
        <div><strong>Type</strong><p>{order.type}</p></div>
        <div><strong>Order ID</strong><p>{order.id}</p></div>
      </div>

      {/* Item */}
      <div className="opm-item">
        {order.postData?.images?.[0] && (
          <img src={order.postData.images[0]} alt="Product" />
        )}
        <div>
          <strong>{order.postData?.title}</strong>
          <p>{order.postData?.description}</p>
        </div>
      </div>

      {/* Payment */}
      <div className="opm-payment">
        <p>Price: ${price.toFixed(2)}</p>
        <p>Fee: ${fee}</p>
        <p>Total: ${total}</p>
      </div>

      {/* Seller */}
      <div>
        <strong>Seller:</strong> {sellerName}
      </div>

      {/* Timeline */}
      <OrderStatusTimeline postId={order.id} orderSide="buyer" />

      {/* Actions */}
      <div className="opm-status-buttons">
        {!order.buyerInfo?.buyerMarkedCompleted && (
          <button onClick={handleMarkCompleted} disabled={statusLoading}>
            Mark Completed
          </button>
        )}

        {!order.buyerInfo?.buyerDispute && (
          <button onClick={handleDispute} disabled={statusLoading}>
            Dispute
          </button>
        )}
      </div>
    </div>
  );
}