import React from 'react';
import NavbarWithPost from '../../../Components/NavbarWithPost';
import DirectoryHeader from './DirectoryHeader';
import '../../../App.css';

const DirectoryPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <DirectoryHeader />
    </div>
  );
};

export default DirectoryPage;
