import "../App.css";
import "./TestPage.css";
import TestPageHeader from "./TestPageHeader";
import DummyOrderSeeder from "./DummyOrderSeeder";
import PaymentMethodsPanel from "../Pages/Seller/PaymentMethodsPanel";

const TestPage = () => {
  return (
    <div className="content-page">
    <TestPageHeader />
    <DummyOrderSeeder />
    <PaymentMethodsPanel />
    </div>
  );
};

export default TestPage;
