import React, { useState, useEffect } from "react";
import OrdersSidePanel from "./OrdersSidePanel";
import MarketVariant from "./MarketVariant";
import EventVariant from "./EventVariant";
import DirectoryVariant from "./DirectoryVariant";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import "./OrdersBody.css";

export default function OrdersBody() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const ordersRef = collection(db, "Orders");
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((order) => order.buyerInfo && order.buyerInfo.email === currentUser.email);
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const renderRightComponent = () => {
    if (selectedIndex === null) return <div>Select an order to see details</div>;
    const order = orders[selectedIndex];
    if (!order) return <div>Order not found</div>;

    switch (order.postType) {
      case "Market":
        return <MarketVariant order={order} />;
      case "Event":
        return <EventVariant order={order} />;
      case "Directory":
        return <DirectoryVariant order={order} />;
      default:
        return <div>Unknown order type</div>;
    }
  };

  return (
    <div className="orders-body-container">
      <OrdersSidePanel
        orders={orders}
        selectedIndex={selectedIndex}
        onCardClick={(index) => setSelectedIndex(index)}
      />
      <div className="orders-body-right">{renderRightComponent()}</div>
    </div>
  );
}
