import React, { useState } from "react";
import "../../App.css";
import LeftSidePanel from "./LeftSidePanel";
import CenterPanel from "./CenterPanel";
import RightSidePanel from "./RightSidePanel";
import "./InboxPage.css";

const InboxPage = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="inbox-page">
      <div className="inbox-layout">
        {/* Pass setActiveChat to update selected chat */}
        <LeftSidePanel setActiveChat={setActiveChat} />
        {/* CenterPanel reads chatId from URL query */}
        <CenterPanel key={activeChat} />
        {/* Optional Right Panel */}
        <RightSidePanel activeChat={activeChat} />
      </div>
    </div>
  );
};

export default InboxPage;
