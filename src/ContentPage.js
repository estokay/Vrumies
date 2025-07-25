import React from 'react';
import NavbarWithPost from './NavbarWithPost';
import ContentHeader from './ContentHeader';
import './App.css'; // Assuming this is where the shared styles live


const ContentPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <ContentHeader />
    </div>
  );
};

export default ContentPage;