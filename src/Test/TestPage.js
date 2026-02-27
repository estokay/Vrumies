import "../App.css";
import "./TestPage.css";
import TestPageHeader from "./TestPageHeader";
import DummyOrderSeeder from "./DummyOrderSeeder";
import PaymentMethodsPanel from "../Pages/Seller/PaymentMethodsPanel";
import ExampleDeletePost from "./ExampleDeletePost";

const TestPage = () => {
  return (
    <div className="content-page">
    <TestPageHeader />
    <DummyOrderSeeder />
    <PaymentMethodsPanel />
    <ExampleDeletePost />
    </div>
  );
};

export default TestPage;
