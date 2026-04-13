import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import "./OrdersPageMobile.css";
import OrdersList from "./OrdersList";
import OrderDetailView from "./OrderDetailView";

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
        <>
          <OrdersList
            orders={orders}
            expandedOrderId={expandedOrderId}
            onToggle={toggleOrder}
          />

          {orders.map(
            (order) =>
              expandedOrderId === order.id && (
                <OrderDetailView key={order.id} order={order} />
              )
          )}
        </>
      )}
    </div>
  );
}