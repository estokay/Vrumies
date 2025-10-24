import React, { useState } from "react";
import SellerSidePanel from "./SellerSidePanel";
import DirectoryVariant from "./OrderDetails/DirectoryVariant";
import EventVariant from "./OrderDetails/EventVariant";
import MarketVariant from "./OrderDetails/MarketVariant";
import "./SellerBody.css";

export default function SellerBody() {
  const [selectedOrder, setSelectedOrder] = useState(null); // store full order object

  const renderRightComponent = () => {
    if (!selectedOrder) return <div>Select an order to see details</div>;

    const { id, type } = selectedOrder;

    switch (type) {
      case "market":
        return <MarketVariant orderId={id} />;
      case "event":
        return <EventVariant orderId={id} />;
      case "directory":
        return <DirectoryVariant orderId={id} />;
      default:
        return <div>Unknown order type</div>;
    }
  };

  return (
    <div className="orders-body-container">
      <SellerSidePanel
        selectedOrder={selectedOrder}
        onCardClick={(order) => setSelectedOrder(order)}
      />
      <div className="orders-body-right">{renderRightComponent()}</div>
    </div>
  );
}
