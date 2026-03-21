import React, { useEffect, useState } from "react";
import { 
  collection, query, where, onSnapshot, doc, updateDoc 
} from "firebase/firestore";
import { db, auth } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaArrowLeft, FaTruck, FaStore, FaList, FaTag } from "react-icons/fa";

// Internal Hooks/Functions based on your uploads
import useSetOrderStatus from "../../CloudFunctions/useSetOrderStatus";
import useGetSellerBalances from "../../Hooks/useGetSellerBalances";
import useGetUsername from "../../Hooks/useGetUsername";
import useGetUserEmail from "../../Hooks/useGetUserEmail";
import OrderStatusTimeline from "../../Components/Orders/OrderStatusTimeline";
import CreateSellerPostOverlayMobile from "../../CreateSellerPostMobile/CreateSellerPostOverlayMobile";

import "./SellerPageMobile.css";

export default function SellerPageMobile() {
  const { currentUser } = useAuth();
  const [view, setView] = useState("list"); // 'list', 'detail', 'payout'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  // 1. Fetch Orders Logic (from SellerSidePanel.js)
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "Orders"),
      where("sellerInfo.sellerId", "==", currentUser.uid),
      where("paymentInfo.paymentSuccessful", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const ordersArray = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      ordersArray.sort((a, b) => (b.orderCreated?.seconds || 0) - (a.orderCreated?.seconds || 0));
      setOrders(ordersArray);
      setLoading(false);
    }, (err) => console.error("Snapshot error:", err));

    return () => unsubscribe();
  }, [currentUser]);

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setView("detail");
  };

  const goBack = () => {
    setView("list");
    setSelectedOrder(null);
  };

  if (!currentUser) return <div className="spm-auth-error">Please log in to view your orders.</div>;

  return (
    <div className="spm-container">
      {/* HEADER SECTION */}
      {view === "list" && (
        <div className="spm-header">
          <div className="spm-header-top">
            <h1 className="spm-title">SELLER <span className="spm-green">HUB</span></h1>
            <button className="spm-payout-btn" onClick={() => setView("payout")}>Balances</button>
          </div>
          <button className="spm-create-btn" onClick={() => setShowCreateOverlay(true)}>
            + Create Sell Post
          </button>
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="spm-content">
        {loading && view === "list" ? (
          <div className="spm-loader">Loading Orders...</div>
        ) : (
          <>
            {view === "list" && <OrderList orders={orders} onCardClick={handleCardClick} />}
            {view === "detail" && <OrderDetailView order={selectedOrder} onBack={goBack} />}
            {view === "payout" && <PayoutView onBack={goBack} userId={currentUser.uid} />}
          </>
        )}
      </div>

      {showCreateOverlay && (
        <CreateSellerPostOverlayMobile 
          isOpen={showCreateOverlay} 
          onClose={() => setShowCreateOverlay(false)} 
        />
      )}
    </div>
  );
}

/** * SUB-COMPONENT: Order List 
 */
function OrderList({ orders, onCardClick }) {
  if (orders.length === 0) return <div className="spm-empty">No orders found.</div>;

  return (
    <div className="spm-list">
      {orders.map((order) => {
        const status = getStatus(order);
        const Icon = getIcon(order.type);
        return (
          <div key={order.id} className="spm-order-card" onClick={() => onCardClick(order)}>
            <div className="spm-card-left">
              <div className={`spm-icon-bg ${order.type}`}><Icon /></div>
            </div>
            <div className="spm-card-body">
              <div className="spm-card-title">{order.postData?.title || "Untitled Order"}</div>
              <div className="spm-card-subtitle">
                {order.orderCreated?.toDate().toLocaleDateString()} • {order.type.toUpperCase()}
              </div>
            </div>
            <div className={`spm-card-status status-${status.replace(" ", "-")}`}>
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** * SUB-COMPONENT: Detail View (Combines logic from all 4 Variant files)
 */
function OrderDetailView({ order, onBack }) {
  const { setOrderStatus, loading: actionLoading } = useSetOrderStatus();
  const [carrier, setCarrier] = useState(order.shippingInfo?.carrier || "");
  const [tracking, setTracking] = useState(order.shippingInfo?.trackingNumber || "");

  const handleAction = async (type) => {
    const payload = { orderId: order.id };
    if (type === "complete") payload.sellerPressedCompleted = true;
    if (type === "dispute") payload.sellerPressedDispute = true;

    const result = await setOrderStatus(payload);
    if (result?.success) window.location.reload(); // Simple refresh to sync state
  };

  const updateTracking = async () => {
    try {
      const ref = doc(db, "Orders", order.id);
      await updateDoc(ref, {
        "shippingInfo.carrier": carrier,
        "shippingInfo.trackingNumber": tracking,
        "shippingInfo.trackingProvided": true
      });
      alert("Tracking updated!");
    } catch (err) { alert("Error updating tracking"); }
  };

  return (
    <div className="spm-detail-view">
      <div className="spm-nav-bar">
        <button onClick={onBack} className="spm-back-link"><FaArrowLeft /> Back</button>
        <span className="spm-detail-id">ID: ...{order.id.slice(-6)}</span>
      </div>

      <section className="spm-section">
        <h2 className="spm-section-title">{order.postData?.title}</h2>
        <div className="spm-item-box">
          <img src={order.postData?.imageUrl || "https://via.placeholder.com/150"} alt="Item" />
          <div className="spm-item-info">
            <p>Price: <strong>${order.postData?.price}</strong></p>
            <p>Buyer: {order.buyerInfo?.buyerUsername || "N/A"}</p>
          </div>
        </div>
      </section>

      {/* Tracking Logic (from Market/Truck Variant) */}
      {(order.type === "market" || order.type === "trucks") && (
        <section className="spm-section">
          <h3>Logistics</h3>
          <div className="spm-input-group">
            <input placeholder="Carrier (UPS, FedEx...)" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
            <input placeholder="Tracking #" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            <button className="spm-track-btn" onClick={updateTracking}>Save Tracking</button>
          </div>
        </section>
      )}

      <section className="spm-section">
        <h3>Order Status</h3>
        <OrderStatusTimeline postId={order.id} orderSide="seller" />
        
        <div className="spm-action-footer">
          {!order.sellerInfo?.sellerMarkedCompleted && !order.sellerInfo?.sellerDispute && (
            <>
              <button className="spm-btn-complete" onClick={() => handleAction("complete")} disabled={actionLoading}>
                {actionLoading ? "..." : "Mark Complete"}
              </button>
              <button className="spm-btn-dispute" onClick={() => handleAction("dispute")} disabled={actionLoading}>
                Dispute
              </button>
            </>
          )}
          {order.sellerInfo?.sellerMarkedCompleted && <div className="spm-status-msg success">✓ Completed</div>}
          {order.sellerInfo?.sellerDispute && <div className="spm-status-msg danger">⚠ Disputed</div>}
        </div>
      </section>
    </div>
  );
}

/** * SUB-COMPONENT: Payout View (Logic from PayoutMethod.js)
 */
function PayoutView({ onBack, userId }) {
  const { available, sent, loading } = useGetSellerBalances();
  const username = useGetUsername(userId);
  const { email } = useGetUserEmail(userId);

  return (
    <div className="spm-payout-view">
      <button onClick={onBack} className="spm-back-link"><FaArrowLeft /> Back to Orders</button>
      <div className="spm-payout-header">
        <h2>PAYOUTS</h2>
        <p className="spm-fee-banner">⚠️ 5% seller fee applies to all orders</p>
      </div>

      <div className="spm-balance-grid">
        <div className="spm-balance-card available">
          <span>Processing</span>
          <div className="spm-amount">${(available ?? 0).toFixed(2)}</div>
        </div>
        <div className="spm-balance-card sent">
          <span>Disbursed</span>
          <div className="spm-amount">${(sent ?? 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="spm-user-info">
        <p>Seller: <strong>{username}</strong></p>
        <p>Payout Email: <strong>{email}</strong></p>
      </div>
    </div>
  );
}

// Helpers
function getStatus(data) {
  if (data?.buyerInfo?.buyerDispute || data?.sellerInfo?.sellerDispute) return "dispute";
  if (data?.buyerInfo?.buyerMarkedCompleted && data?.sellerInfo?.sellerMarkedCompleted) return "completed";
  return "in progress";
}

function getIcon(type) {
  switch (type) {
    case "market": return FaStore;
    case "trucks": return FaTruck;
    case "offer": return FaTag;
    default: return FaList;
  }
}