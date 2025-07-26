import React from 'react';
import NavbarWithPost from './NavbarWithPost';
import RequestHeader from './RequestHeader';
import './App.css'; // Assuming this is where the shared styles live


const RequestPage = () => {
  return (
    <div className="request-page">
      <NavbarWithPost />
      <RequestHeader />
    </div>
  );
};

export default RequestPage;