import "../App.css";
import "./TestPage.css";
import TestPageHeader from "./TestPageHeader";
import ImageUploadTest from "./ImageUploadTest";
import DummyOrderSeeder from "./DummyOrderSeeder";

const TestPage = () => {
  return (
    <div className="content-page">
    <TestPageHeader />
    <ImageUploadTest />
    <DummyOrderSeeder />
    </div>
  );
};

export default TestPage;
