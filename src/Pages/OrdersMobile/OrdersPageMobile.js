import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import useSetOrderStatus from "../../CloudFunctions/useSetOrderStatus";
import checkPrice from "../../Functions/checkPrice";
import "./OrdersPageMobile.css";

// Mobile Order Status Timeline
function MobileOrderStatusTimeline({ postId, orderSide }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!postId) return;
    const orderRef = doc(db, "Orders", postId);
    const unsubscribe = onSnapshot(
      orderRef,
      (snap) => {
        if (snap.exists()) setOrder(snap.data());
        else setOrder(null);
      },
      (err) => console.error(err)
    );
    return () => unsubscribe();
  }, [postId]);

  if (!order) return <p>Loading status...</p>;

  const buyerCompleted = order.buyerInfo?.buyerMarkedCompleted || false;
  const sellerCompleted = order.sellerInfo?.sellerMarkedCompleted || false;
  const buyerDispute = order.buyerInfo?.buyerDispute || false;
  const sellerDispute = order.sellerInfo?.sellerDispute || false;

  const disputeActive = buyerDispute || sellerDispute;
  const completedActive = buyerCompleted && sellerCompleted;

  const markedCompletedLabel =
    orderSide === "buyer"
      ? "Marked Completed by Seller"
      : "Marked Completed by Buyer";

  const markedCompletedActive =
    orderSide === "buyer" ? sellerCompleted : buyerCompleted;

  return (
    <div className="opm-timeline-wrapper">
      <div className="opm-timeline-main">
        <div className={`opm-step active`}>Order Started</div>
        <div className={`opm-step ${markedCompletedActive ? "active" : ""}`}>
          {markedCompletedLabel}
        </div>
        <div className={`opm-step ${completedActive ? "active" : ""}`}>
          Completed
        </div>
      </div>
      <div className="opm-timeline-dispute">
        <div className={`opm-circle-dispute ${disputeActive ? "active" : ""}`}>
          {disputeActive && <FaTimes />}
        </div>
        <p className={`opm-dispute-label ${disputeActive ? "active" : ""}`}>
          Dispute
        </p>
      </div>
    </div>
  );
}

// Single Order Card with collapsible details
function MobileOrderCard({ order, expanded, onToggle }) {
  const [sellerName, setSellerName] = useState("N/A");
  const { setOrderStatus, loading: statusLoading } = useSetOrderStatus();

  useEffect(() => {
    const fetchSeller = async () => {
      if (!order?.sellerInfo?.sellerId) return;
      try {
        const userRef = doc(db, "Users", order.sellerInfo.sellerId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setSellerName(userSnap.data().username || "N/A");
      } catch (err) {
        console.error("Error fetching seller:", err);
      }
    };
    fetchSeller();
  }, [order]);

  const handleMarkCompleted = async () => {
    const result = await setOrderStatus({
      orderId: order.id,
      buyerPressedCompleted: true,
    });
    if (result?.success) {
      order.buyerInfo = { ...order.buyerInfo, buyerMarkedCompleted: true };
    }
  };

  const handleDispute = async () => {
    const result = await setOrderStatus({
      orderId: order.id,
      buyerPressedDispute: true,
    });
    if (result?.success) {
      order.buyerInfo = { ...order.buyerInfo, buyerDispute: true };
    }
  };

  const price = checkPrice(order.price || 0);
  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);

  return (
    <div className="opm-card">
      <div className="opm-card-header" onClick={onToggle}>
        <p>
          {order.postData?.title || order.type || "Order"} -{" "}
          {new Date(order.orderCreated?.seconds * 1000).toLocaleDateString()}
        </p>
        <div className="opm-card-icons">
          {order.buyerInfo?.buyerDispute && <span className="opm-badge-dispute">⚠ Dispute</span>}
          {order.buyerInfo?.buyerMarkedCompleted && <span className="opm-badge-complete">✓ Completed</span>}
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {expanded && (
        <div className="opm-detail-panel">
          {/* Order Details */}
          <div className="opm-info">
            <div>
              <strong>Date</strong>
              <p>{new Date(order.orderCreated?.seconds * 1000).toLocaleDateString()}</p>
            </div>
            <div>
              <strong>Type</strong>
              <p>{order.type}</p>
            </div>
            <div>
              <strong>Order ID</strong>
              <p>{order.id}</p>
            </div>
          </div>

          {/* Variant Fields */}
          {order.type === "trucks" && (
            <div className="opm-tracking-display">
              <div>
                <strong>Pickup Address</strong>
                <p>{order.trucksSpecific?.pickupAddress || "N/A"}</p>
              </div>
              <div>
                <strong>Drop-Off Address</strong>
                <p>{order.trucksSpecific?.dropoffAddress || "N/A"}</p>
              </div>
              <div>
                <strong>Load Weight</strong>
                <p>{order.trucksSpecific?.loadWeight || "N/A"} lbs</p>
              </div>
              <div>
                <strong>Load Length</strong>
                <p>{order.trucksSpecific?.loadLength || "N/A"} ft</p>
              </div>
              <div>
                <strong>Distance</strong>
                <p>{order.trucksSpecific?.distance || "N/A"} miles</p>
              </div>
              <div>
                <strong>Rate Per Mile</strong>
                <p>${(order.trucksSpecific?.rpm || 0).toFixed(2)}</p>
              </div>
            </div>
          )}

          {order.type === "market" && (
            <div className="opm-tracking-display">
              <div>
                <strong>Carrier</strong>
                <p>{order.marketSpecific?.Carrier || "N/A"}</p>
              </div>
              <div>
                <strong>Tracking Number</strong>
                <p>{order.marketSpecific?.trackingNumber || "N/A"}</p>
              </div>
            </div>
          )}

          {order.type === "event" && (
            <p>
              Delivery Address:{" "}
              {order.deliveryInfo
                ? `${order.deliveryInfo.deliveryStreetAddress || ""}, ${order.deliveryInfo.deliveryCity || ""}, ${order.deliveryInfo.deliveryState || ""} ${order.deliveryInfo.deliveryZipCode || ""}`
                : "N/A"}
            </p>
          )}

          {/* Ordered Item */}
          <div className="opm-item">
            {order.postData?.images?.[0] && (
              <img src={order.postData.images[0]} alt="Product" />
            )}
            <div>
              <div>
                <strong>Title</strong>
                <p>{order.postData?.title || "N/A"}</p>
              </div>
              <div>
                <strong>Description</strong>
                <p>{order.postData?.description || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="opm-payment">
            <div>
              <strong>Price</strong>
              <p>${price.toFixed(2)}</p>
              <strong>Transaction Fee (15%)</strong>
              <p>${transactionFee}</p>
              <strong>Total</strong>
              <p>${total}</p>
            </div>
            <div>
              <strong>Payment Method</strong>
              <p>{order.paymentInfo?.paymentMethod || "N/A"}</p>
              <strong>Last 4 digits</strong>
              <p>{order.paymentInfo?.lastFour || "N/A"}</p>
            </div>
          </div>

          {/* Seller */}
          <div>
            <strong>Seller</strong>
            <p>{sellerName}</p>
            <button className="opm-btn-message">Message User</button>
          </div>

          {/* Status */}
          <MobileOrderStatusTimeline postId={order.id} orderSide="buyer" />

          <div className="opm-status-buttons">
            {!order.buyerInfo?.buyerMarkedCompleted &&
              !order.buyerInfo?.buyerDispute &&
              !order.sellerInfo?.sellerDispute && (
                <button
                  className="opm-btn-complete"
                  onClick={handleMarkCompleted}
                  disabled={statusLoading}
                >
                  {statusLoading ? "Processing..." : "Mark as Completed"}
                </button>
              )}

            {order.buyerInfo?.buyerMarkedCompleted && (
              <button className="opm-btn-completed" disabled>
                ✓ Marked Completed
              </button>
            )}

            {!order.buyerInfo?.buyerDispute &&
              !order.buyerInfo?.buyerMarkedCompleted && (
                <button
                  className="opm-btn-dispute"
                  onClick={handleDispute}
                  disabled={statusLoading}
                >
                  {statusLoading ? "Processing..." : "Dispute"}
                </button>
              )}

            {order.buyerInfo?.buyerDispute && (
              <button className="opm-btn-disputed" disabled>
                ⚠ Disputed Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Orders Page
export default function OrdersPageMobile() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const ordersRef = collection(db, "Orders");
    const q = query(
      ordersRef,
      where("buyerInfo.buyerId", "==", currentUser.uid),
      where("paymentInfo.paymentSuccessful", "==", true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        ordersArray.sort((a, b) => (b.orderCreated?.seconds || 0) - (a.orderCreated?.seconds || 0));
        setOrders(ordersArray);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const toggleOrder = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (!currentUser) return <div>Please log in to see your orders.</div>;

  return (
    <div className="opm-full-container">
      <h2 className="opm-title">MY ORDERS</h2>

      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div>No Orders Made Yet...</div>
      ) : (
        orders.map((order) => (
          <MobileOrderCard
            key={order.id}
            order={order}
            expanded={expandedOrderId === order.id}
            onToggle={() => toggleOrder(order.id)}
          />
        ))
      )}
    </div>
  );
}