import { useState } from 'react';
import DirectoryHeader from './DirectoryHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from '../../../Components/SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css';

const DirectoryPage = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="mainpage">
      <DirectoryHeader />

      {/* Pass search query setter to SearchBar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="videos-main">
        {/* FilterPanel now receives searchQuery */}
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

export default DirectoryPage;
