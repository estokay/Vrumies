import "../App.css";
import "./TestPage.css";
import TestPageHeader from "./TestPageHeader";
import DummyOrderSeeder from "./DummyOrderSeeder";
import PaymentMethodsPanel from "../Pages/Seller/PaymentMethodsPanel";
import ExampleDeletePost from "./ExampleDeletePost";
import ProfileCardLayout from "../Components/Profile/ProfileCardLayout";
import SignInOverlay from "../Portal/SignInOverlay"; // adjust path if needed
//import AuthOverlay from "../Portal/AuthOverlay";
import React, { useState } from "react";
import createDummyCalendarData from "./createDummyCalendarData";

const TestPage = () => {
  const [manualOverlayOpen, setManualOverlayOpen] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(false);

  const handleCreateCalendar = async () => {
    try {
      const calendarId = await createDummyCalendarData();
      alert(`Calendar created: ${calendarId}`);
    } catch (error) {
      alert("Failed to create calendar");
    }
  };

  return (
    <div className="content-page">
    <TestPageHeader />
    <DummyOrderSeeder />
    <PaymentMethodsPanel />
    <ExampleDeletePost />
    <ProfileCardLayout />

     {/* Button to manually trigger SignInOverlay */}
      <button onClick={() => setManualOverlayOpen(true)}>
        Show SignInOverlay
      </button>

      {/* Toggle user sign-in state for testing AuthOverlay */}
      <button onClick={() => setUserSignedIn(!userSignedIn)}>
        {userSignedIn ? "Set Signed Out" : "Set Signed In"}
      </button>

      {/* Manual overlay */}
      <SignInOverlay isOpen={manualOverlayOpen} />

      {/* Automatic interaction overlay */}
      {/* <AuthOverlay isSignedIn={userSignedIn} /> */}

      <div style={{ marginTop: "40px" }}>
        <button onClick={handleCreateCalendar}>
          Create Availability Calendar
        </button>
      </div>

      
    </div>
  );
};

export default TestPage;
