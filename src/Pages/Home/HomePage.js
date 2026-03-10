import { useEffect, useState } from 'react';
import HomeHeader from './HomeHeader';
import './HomePage.css';
import ViewTopRatedSellers from "./ViewTopRatedSellers";
import Following from './Following';
import Popular from './Popular';
import PromotedPosts from './PromotedPosts';
import MoreFromSellers from './MoreFromSellers';
import NewPosts from './NewPosts';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="home-page">
      <HomeHeader />
      {/* <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}  /> */}
      <NewPosts />
      <Popular />
      <Following />
      <ViewTopRatedSellers />
      <PromotedPosts />
      <MoreFromSellers />

    </div>
  );
};

export default HomePage;
