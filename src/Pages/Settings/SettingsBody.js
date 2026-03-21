import React from "react";
import BlockedUsers from "./BlockedUsers";
import ReferralCode from "./ReferralCode";
import HelpSection from "./HelpSection";
import ViewMode from "./ViewMode";
import "./SettingsBody.css";

export default function SettingsBody({ selected }) {
  return (
    <div className="settings-body">
      {selected === "blocked" && <BlockedUsers />}
      {selected === "referral" && <ReferralCode />}
      {selected === "help" && <HelpSection />}
      {selected === "viewmode" && <ViewMode />}
    </div>
  );
}
