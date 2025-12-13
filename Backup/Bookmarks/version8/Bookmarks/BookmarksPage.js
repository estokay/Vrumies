import BookmarksHeader from './BookmarksHeader';
import '../../App.css';
import '../../Components/Css/MainPage.css';
import RightSidePanel from './RightSidePanel';
import BookmarksPostGrid from './BookmarksPostGrid';
import FilterPanel from './FilterPanel';
import SearchBar from './SearchBar';

const BookmarksPage = () => {
  return (
    <div className="mainpage">
      <BookmarksHeader />
      <SearchBar />

      <div className="videos-main">
        <FilterPanel />
        <BookmarksPostGrid />
        <RightSidePanel />
      </div>
    </div>
  );
};

export default BookmarksPage;
