import React from 'react';
import './ViewContentPostHeader.css';

function ViewContentPostHeader({
  userName = 'MARCEL DARIUS',
  userImage = '/path/to/avatar.jpg',
  location = 'Houston, TX',
  postTitle = 'Cell Phone Use While Driving',
  date = 'MARCH 29, 2022',
  categories = ['VRUMIES', 'Videos', 'VRUMIES', 'Videos', 'VRUMIES', 'Videos']
}) {
  return (
    <div className="view-post-header">
      <div className="category-bar">
        {categories.map((cat, index) => (
          <span
            key={index}
            className={`category-item ${cat === 'Videos' ? 'highlighted' : ''}`}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="post-info">
        <div className="author">
          <img src={userImage} alt="User" className="avatar" />
          <span className="user-name">{userName}</span>
        </div>

        <div className="post-title">
          <h2>{postTitle}</h2>
          <p className="location">{location}</p>
        </div>

        <div className="post-date">
          {date}
        </div>
      </div>
    </div>
  );
}

export default ViewContentPostHeader;
