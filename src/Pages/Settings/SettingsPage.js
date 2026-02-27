import '../../App.css';
import SettingsSidePanel from './SettingsSidePanel';
import SettingsBody from "./SettingsBody";
import "./SettingsPage.css";
import React, { useState } from "react";
import PageHeader from '../../Components/PageHeader';

const SettingsPage = () => {
  const [selected, setSelected] = useState("referral");
  return (
    <div className="content-page">
      <PageHeader 
        title="Settings" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1772138760/blue-gears-machinery-vector_ad0ucz.jpg" 
      />
      <div className="settings-page">
      <SettingsSidePanel onSelect={setSelected} selected={selected} />
      <SettingsBody selected={selected} />
    </div>
      
    </div>
  );
};

export default SettingsPage;
