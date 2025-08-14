import NavbarWithPost from '../../Components/NavbarWithPost';
import '../../App.css';
import './ViewProfile.css';
import React, { useState } from "react";
import ViewProfileSidePanel from './ViewProfileSidePanel';
import ViewProfileCategories from "./ViewProfileCategories";

const ViewProfile = () => {

  return (
    <div className="content-page">
      <NavbarWithPost />
      <div className="view-profile">
              <div className="view-profile-sidepanel">
                <ViewProfileSidePanel />
              </div>
              <div className="view-profile-categories">
                <ViewProfileCategories />
              </div>
        </div>
    </div>
  );
};

export default ViewProfile;
