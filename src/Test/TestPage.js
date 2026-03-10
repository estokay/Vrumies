import "../App.css";
import "./TestPage.css";
import TestPageHeader from "./TestPageHeader";
import DummyOrderSeeder from "./DummyOrderSeeder";
import PaymentMethodsPanel from "../Pages/Seller/PaymentMethodsPanel";
import ExampleDeletePost from "./ExampleDeletePost";
import ProfileCardLayout from "../Components/Profile/ProfileCardLayout";

const TestPage = () => {
  return (
    <div className="content-page">
    <TestPageHeader />
    <DummyOrderSeeder />
    <PaymentMethodsPanel />
    <ExampleDeletePost />
    <ProfileCardLayout />
    </div>
  );
};

export default TestPage;
