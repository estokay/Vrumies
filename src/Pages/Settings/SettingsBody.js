import React from "react";
import BlockedUsers from "./BlockedUsers";
import ReferralCode from "./ReferralCode";
import "./SettingsBody.css";

export default function SettingsBody({ selected }) {
  return (
    <div className="settings-body">
      {selected === "blocked" && <BlockedUsers />}
      {selected === "referral" && <ReferralCode />}
    </div>
  );
}
