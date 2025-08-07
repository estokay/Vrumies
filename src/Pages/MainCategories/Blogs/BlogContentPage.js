import React from 'react';
import NavbarWithPost from '../../../Components/NavbarWithPost';
import BlogContentHeader from './BlogContentHeader';
import '../../../App.css'; // Assuming this is where the shared styles live
import BlogPostGrid from './BlogPostGrid';
import { examplePosts } from '../../../Data/BlogDummyData';
import './BlogContentPage.css';
import BlogRightSidePanel from './BlogRightSidePanel';


const BlogContentPage = () => {
  return (
    <div className="blog-page">
      <NavbarWithPost />
      <BlogContentHeader />
      <div className="main-content">
        <BlogPostGrid posts={examplePosts} />
        <BlogRightSidePanel posts={examplePosts} />
      </div>
      
    </div>
  );
};

export default BlogContentPage;