import NavbarWithPost from '../../Components/NavbarWithPost';
import '../../App.css';
import './MyProfile.css';
import React from "react";
import MyProfileSidePanel from './MyProfileSidePanel';
import MyProfileCategories from "./MyProfileCategories";
import MyProfileBody from "./MyProfileBody";

const MyProfile = () => {
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
            <MyProfileCategories />
          </div>

          <div className="my-profile-section">
            <MyProfileBody />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
