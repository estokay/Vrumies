import React, { useState } from "react";
import Users from "./Collections/Users";
import Videos from "./Collections/Videos";
import Blogs from "./Collections/Blogs";
import Forums from "./Collections/Forums";
import Requests from "./Collections/Requests";
import Market from "./Collections/Market";
import Events from "./Collections/Events";
import Directory from "./Collections/Directory";

function ViewFirestoreData() {
  const tabs = [
    "Users",
    "Videos",
    "Blogs",
    "Forums",
    "Requests",
    "Market",
    "Events",
    "Directory",
  ];

  const [activeTab, setActiveTab] = useState("Users");

  const renderComponent = () => {
    switch (activeTab) {
      case "Users":
        return <Users />;
      case "Videos":
        return <Videos />;
      case "Blogs":
        return <Blogs />;
      case "Forums":
        return <Forums />;
      case "Requests":
        return <Requests />;
      case "Market":
        return <Market />;
      case "Events":
        return <Events />;
      case "Directory":
        return <Directory />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20, background: "#111", color: "white" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: activeTab === tab ? "#444" : "#222",
              color: "white",
              fontWeight: activeTab === tab ? "bold" : "normal",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Component */}
      <div>{renderComponent()}</div>
    </div>
  );
}

export default ViewFirestoreData;
