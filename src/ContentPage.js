import React from 'react';
import NavbarWithPost from './NavbarWithPost';
import ContentHeader from './ContentHeader';
import './App.css'; // Assuming this is where the shared styles live
import PostGrid from './PostGrid';
import ExampleVideoPost from './ExampleVideoPost';
import { examplePosts } from './VideoDummyData';
import './ContentPage.css';
import RightSidePanel from './RightSidePanel';


const ContentPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <ContentHeader />
      <div className="main-content">
        <PostGrid posts={examplePosts} />
        <RightSidePanel posts={examplePosts} />
      </div>
      
    </div>
  );
};

export default ContentPage;