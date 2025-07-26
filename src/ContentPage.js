import React from 'react';
import NavbarWithPost from './NavbarWithPost';
import ContentHeader from './ContentHeader';
import './App.css'; // Assuming this is where the shared styles live
import PostGrid from './PostGrid';
import VideoPost from './VideoPost';
import ExamplePosts from './ExamplePosts';


const ContentPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <ContentHeader />
      <PostGrid />
      <ExamplePosts />
    </div>
  );
};

export default ContentPage;