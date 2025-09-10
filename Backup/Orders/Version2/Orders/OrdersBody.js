import React, { useState } from "react";
import OrdersSidePanel from "./OrdersSidePanel";
import DirectoryVariant from "./DirectoryVariant";
import EventVariant from "./EventVariant";
import MarketVariant from "./MarketVariant";
import "./OrdersBody.css";

export default function OrdersBody() {
  const [selectedIndex, setSelectedIndex] = useState(null); // no selection initially

  const renderRightComponent = () => {
    if (selectedIndex === 0) return <MarketVariant />;
    if (selectedIndex === 1) return <EventVariant />;
    if (selectedIndex === 2) return <DirectoryVariant />;
    return <div>Select an order to see details</div>;
  };

  return (
    <div className="orders-body-container">
      <OrdersSidePanel
        selectedIndex={selectedIndex}
        onCardClick={(index) => setSelectedIndex(index)}
      />
      <div className="orders-body-right">{renderRightComponent()}</div>
    </div>
  );
}
