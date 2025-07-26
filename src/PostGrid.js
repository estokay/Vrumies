// src/PostGrid.js
import React from 'react';
import VideoPost from './VideoPost';
import './PostGrid.css';

const dummyData = Array.from({ length: 16 }).map((_, i) => ({
  thumbnail: `${process.env.PUBLIC_URL}/thumbnail-${(i % 5) + 1}.jpg`,
  title: `Post ${i + 1}`,
  creator: `Creator ${i + 1}`,
  date: 'Jul 25, 2025',
  views: 1000 + i * 5,
  likes: 150 + i,
  comments: 20 + i * 2,
  duration: '12:34',
  profilePic: `${process.env.PUBLIC_URL}/profile-${(i % 3) + 1}.jpg`,
}));

const PostGrid = () => {
  return (
    <div className="post-grid-container">
      {dummyData.map((post, index) => (
        <VideoPost key={index} {...post} />
      ))}
    </div>
  );
};

export default PostGrid;
