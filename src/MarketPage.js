import React from 'react';
import NavbarWithPost from './NavbarWithPost';
import MarketHeader from './MarketHeader';
import './App.css';

const MarketPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <MarketHeader />
    </div>
  );
};

export default MarketPage;
