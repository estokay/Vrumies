import { useEffect, useState } from 'react';
import EventsHeader from './EventsHeader';
import '../../../App.css';
import MainPostGrid from '../../../Components/MainPostGrid';
import FilterPanel from './FilterPanel';
import RightSidePanel from './RightSidePanel';
import SearchBar from '../../../Components/SearchBar';
import '../../../Components/Css/MainPage.css';

const EventsPage = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="mainpage">
      <EventsHeader />

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

export default EventsPage;
