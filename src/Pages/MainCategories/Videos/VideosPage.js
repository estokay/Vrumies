import { useEffect, useState } from 'react';

import VideosHeader from './VideosHeader';
import '../../../App.css';
import '../../../Components/Css/MainPage.css';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from '../../../Components/SearchBar';
import FilterPanel from './FilterPanel';
import RightSidePanel from './RightSidePanel';

const VideosPage = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 

  return (
    <div className="mainpage">
      <VideosHeader />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="videos-main">
        <FilterPanel
          searchQuery={searchQuery}
          onFilteredPosts={setFilteredPosts}
        />

        <MainPostGrid posts={filteredPosts} />
        
        <RightSidePanel posts={filteredPosts} />
      </div>
    </div>
  );
};

export default VideosPage;
