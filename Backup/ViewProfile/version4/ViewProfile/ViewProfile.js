import '../../App.css';
import '../../Components/Css/Profile.css';
import React, { useState } from "react";
import ViewProfileSidePanel from './ViewProfileSidePanel';
import ViewProfileCategories from "./ViewProfileCategories";
import ViewProfileBody from "./ViewProfileBody";

const ViewProfile = () => {
  const [selectedCategory, setSelectedCategory] = useState("content"); // default

  return (
    <div className="content-page">
      <div className="my-profile">
        {/* Left side panel */}
        <div className="my-profile-sidepanel">
          <ViewProfileSidePanel />
        </div>

        {/* Right side (categories + body stacked) */}
        <div className="my-profile-right">
          <div className="my-profile-section">
            <ViewProfileCategories 
              selected={selectedCategory} 
              setSelected={setSelectedCategory} 
            />
          </div>

          <div className="my-profile-section">
            <ViewProfileBody selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
