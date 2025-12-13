import React from 'react';
import './BookmarksHeader.css';

const BookmarksHeader = () => {
  return (
    <div className="events-header-container">
      <div className="left-side">
        <h1 className="title">
          <span className="green-highlight">BOOKMARKS</span>
        </h1>
        <p className="subtitle">VIEW ALL YOUR SAVED POSTS</p>
      </div>

      <div className="right-side">
        <img
          src={`${process.env.PUBLIC_URL}/category-icons/bookmark.png`}
          alt="Bookmarks Icon"
          width="70"
          height="70"
          className="events-icon"
        />
      </div>
    </div>
  );
};

export default BookmarksHeader;
