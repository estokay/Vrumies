import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import OrdersList from "./OrdersList";
import OrderDetailView from "./OrderDetailView";
import "./OrdersPageMobile.css";

export default function OrdersPageMobile() {
  const { currentUser } = useAuth();
  const [view, setView] = useState("list"); // list | detail
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "Orders"),
      where("buyerInfo.buyerId", "==", currentUser.uid),
      where("paymentInfo.paymentSuccessful", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      ordersArray.sort((a, b) => (b.orderCreated?.seconds || 0) - (a.orderCreated?.seconds || 0));
      setOrders(ordersArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) return <div className="bpm-container">Please log in.</div>;

  return (
    <div className="bpm-container">
      {view === "list" && (
        <header className="bpm-header">
          <div className="bpm-header-top">
            <h1 className="bpm-title">MY <span className="bpm-green">ORDERS</span></h1>
          </div>
        </header>
      )}

      <div className="bpm-content">
        {loading && view === "list" ? (
          <div className="bpm-loader">Loading Orders...</div>
        ) : (
          <>
            {view === "list" && (
              <OrdersList
                orders={orders}
                onCardClick={(order) => {
                  setSelectedOrder(order);
                  setView("detail");
                }}
              />
            )}

            {view === "detail" && (
              <OrderDetailView
                order={selectedOrder}
                onBack={() => {
                  setSelectedOrder(null);
                  setView("list");
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}