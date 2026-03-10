import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import MarketOrderCard from "./Cards/MarketOrderCard";
import OfferOrderCard from "./Cards/OfferOrderCard";
import DirectoryOrderCard from "./Cards/DirectoryOrderCard";
import TruckOrderCard from "./Cards/TruckOrderCard";
import "./OrdersSidePanel.css";

export default function OrdersSidePanel({ selectedOrder, onCardClick }) {
  const { currentUser } = useAuth();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      (querySnapshot) => {
        const ordersArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by most recent
        ordersArray.sort(
          (a, b) => b.orderCreated?.seconds - a.orderCreated?.seconds
        );

        setFilteredOrders(ordersArray);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to user orders:", error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount or user change
    return () => unsubscribe();
  }, [currentUser]);

  const renderCard = (order) => {
    let CardComponent;

    switch (order.type) {
      case "market":
        CardComponent = MarketOrderCard;
        break;
      case "offer":
        CardComponent = OfferOrderCard;
        break;
      case "directory":
        CardComponent = DirectoryOrderCard;
        break;
      case "trucks":
        CardComponent = TruckOrderCard;
        break;
      default:
        return null;
    }

    return (
      <div
        key={order.id}
        className={`osp-card ${
          selectedOrder?.id === order.id ? "selected-card" : ""
        }`}
        onClick={() => onCardClick(order)}
      >
        <CardComponent orderId={order.id} />
      </div>
    );
  };

  if (!currentUser) return <div>Please log in to see your orders.</div>;

  return (
    <div className="osp-panel">
      <h2 className="osp-title">MY ORDERS</h2>
      <div className="osp-list">
        {loading ? (
          <div>Loading orders...</div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => renderCard(order))
        ) : (
          <div>No orders found.</div>
        )}
      </div>
    </div>
  );
}