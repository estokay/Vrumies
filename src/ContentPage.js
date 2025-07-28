import React from 'react';
import NavbarWithPost from './NavbarWithPost';
import ContentHeader from './ContentHeader';
import './App.css'; // Assuming this is where the shared styles live
import PostGrid from './PostGrid';
import ExampleVideoPost from './ExampleVideoPost';
import { examplePosts } from './VideoDummyData';


const ContentPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <ContentHeader />
      <PostGrid posts={examplePosts} />
      {/*<ExampleVideoPost />*/}
    </div>
  );
};

export default ContentPage;