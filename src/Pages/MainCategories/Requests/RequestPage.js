import React from 'react';
import NavbarWithPost from '../../../Components/NavbarWithPost';
import RequestHeader from './RequestHeader';
import '../../../App.css'; // Assuming this is where the shared styles live
import RequestPostGrid from './RequestPostGrid';
import { examplePosts } from '../../../Data/RequestDummyData';
import './RequestPage.css';
import RequestRightSidePanel from './RequestRightSidePanel';


const RequestPage = () => {
  return (
    <div className="content-page">
      
      <RequestHeader />
      <div className="main-content">
        <RequestPostGrid posts={examplePosts} />
        <RequestRightSidePanel posts={examplePosts} />
      </div>
    </div>
  );
};

export default RequestPage;