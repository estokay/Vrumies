import NavbarWithPost from '../../Components/NavbarWithPost';
import '../../App.css';
import './MyProfile.css';
import React, { useState } from "react";
import MyProfileSidePanel from './MyProfileSidePanel';
import MyProfileCategories from "./MyProfileCategories";
import MyProfileBody from "./MyProfileBody";

const MyProfile = () => {
  const [selectedCategory, setSelectedCategory] = useState("content"); // default

  return (
    <div className="content-page">
      <div className="my-profile">
        {/* Left side panel */}
        <div className="my-profile-sidepanel">
          <MyProfileSidePanel />
        </div>

        {/* Right side (categories + body stacked) */}
        <div className="my-profile-right">
          <div className="my-profile-section">
            <MyProfileCategories 
              selected={selectedCategory} 
              setSelected={setSelectedCategory} 
            />
          </div>

          <div className="my-profile-section">
            <MyProfileBody selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
