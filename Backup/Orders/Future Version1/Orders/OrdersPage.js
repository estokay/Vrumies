import React from "react";
import OrdersPageHeader from "./OrdersPageHeader";
import OrdersBody from "./OrdersBody";
import "../../App.css";

const OrdersPage = () => {
  return (
    <div className="content-page">
      <OrdersPageHeader />
      <OrdersBody />
    </div>
  );
};

export default OrdersPage;
