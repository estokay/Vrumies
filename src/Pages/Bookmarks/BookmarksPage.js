import React from 'react';
import BookmarksHeader from './BookmarksHeader';
import '../../App.css'; // Assuming this is where the shared styles live
import PostGrid from './PostGrid';
import { examplePosts } from '../../Data/VideoDummyData';
import './BookmarksPage.css';
import RightSidePanel from './RightSidePanel';


const ContentPage = () => {
  return (
    <div className="content-page">
      {/* <NavbarWithPost /> */}
      <BookmarksHeader />
      <div className="main-content">
        <PostGrid posts={examplePosts} />
        <RightSidePanel posts={examplePosts} />
      </div>
      
    </div>
  );
};

export default ContentPage;