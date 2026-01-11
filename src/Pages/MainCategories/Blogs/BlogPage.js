import { useEffect, useState } from 'react';
import BlogHeader from './BlogHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from '../../../Components/SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css';

const BlogPage = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="mainpage">
      <BlogHeader />

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

export default BlogPage;
