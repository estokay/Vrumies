import "../App.css";
import "./TestPage.css";
import TestPageHeader from "./TestPageHeader";
import ImageUploadTest from "./ImageUploadTest";
import DummyOrderSeeder from "./DummyOrderSeeder";
import ViewOffers from "../Custom Offers/ViewOffers";

const TestPage = () => {
  return (
    <div className="content-page">
    <TestPageHeader />
    <ImageUploadTest />
    <DummyOrderSeeder />
    <ViewOffers />
    </div>
  );
};

export default TestPage;
