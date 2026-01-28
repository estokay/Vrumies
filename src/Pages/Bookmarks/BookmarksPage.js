import React, { useState } from 'react';
import BookmarksHeader from './BookmarksHeader';
import '../../App.css';
import '../../Components/Css/MainPage.css';
import RightSidePanel from './RightSidePanel';
import BookmarksPostGrid from './BookmarksPostGrid';
import FilterPanel from './FilterPanel';
import SearchBar from '../../Components/SearchBar';

const BookmarksPage = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="mainpage">
      <BookmarksHeader />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="videos-main">
        <FilterPanel
          searchQuery={searchQuery}
          onFilteredPosts={setFilteredPosts}
        />

        <BookmarksPostGrid posts={filteredPosts} />
        
        <RightSidePanel posts={filteredPosts} />
      </div>
    </div>
  );
};

export default BookmarksPage;
