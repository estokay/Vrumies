import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import MarketOrderCard from "./Cards/MarketOrderCard";
import EventOrderCard from "./Cards/EventOrderCard";
import DirectoryOrderCard from "./Cards/DirectoryOrderCard";
import "./OrdersSidePanel.css";

export default function OrdersSidePanel({ selectedOrder, onCardClick }) {
  const { currentUser } = useAuth();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "Orders");
        const q = query(
          ordersRef,
          where("buyerInfo.buyerId", "==", currentUser.uid),
          where("paymentInfo.paymentSuccessful", "==", true)
        );

        const querySnapshot = await getDocs(q);
        const ordersArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by most recent
        ordersArray.sort(
          (a, b) => b.orderCreated.seconds - a.orderCreated.seconds
        );

        setFilteredOrders(ordersArray);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const renderCard = (order) => {
    let CardComponent;

    switch (order.type) {
      case "market":
        CardComponent = MarketOrderCard;
        break;
      case "event":
        CardComponent = EventOrderCard;
        break;
      case "directory":
        CardComponent = DirectoryOrderCard;
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
