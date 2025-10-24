import '../../App.css';
import SettingsSidePanel from './SettingsSidePanel';
import SettingsBody from "./SettingsBody";
import "./SettingsPage.css";
import React, { useState } from "react";

const SettingsPage = () => {
  const [selected, setSelected] = useState("referral");
  return (
    <div className="content-page">
      
      <div className="settings-page">
      <SettingsSidePanel onSelect={setSelected} selected={selected} />
      <SettingsBody selected={selected} />
    </div>
      
    </div>
  );
};

export default SettingsPage;
