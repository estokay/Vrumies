import NavbarWithPost from '../../Components/NavbarWithPost';
import '../../App.css';
import './MyProfile.css';
import React, { useState } from "react";
import MyProfileSidePanel from './MyProfileSidePanel';
import MyProfileCategories from "./MyProfileCategories";
import PostGrid from './Body/PostGrid';
import { examplePosts } from '../../Data/VideoDummyData';

const MyProfile = () => {
  
  return (
    <div className="content-page">
      <NavbarWithPost />
      <div className="my-profile">
        <div className="my-profile-sidepanel">
          <MyProfileSidePanel />
        </div>
        <div className="my-profile-categories">
          <MyProfileCategories />
          
        </div>
        
      </div>
      <PostGrid posts={examplePosts} />
    </div>
  );
};

export default MyProfile;
