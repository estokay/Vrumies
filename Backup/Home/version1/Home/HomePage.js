import { useEffect, useState } from 'react';
import HomeHeader from './HomeHeader';
import '../../App.css';
import SearchBar from './SearchBar';
import '../../App.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="content-page">
      <HomeHeader />
      {/* <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}  /> */}

    </div>
  );
};

export default HomePage;
