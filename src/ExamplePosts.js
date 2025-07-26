import React from 'react';
import VideoPost from './VideoPost';

function ExamplePosts() {
  const post = {
    id: 0,
    thumbnail: `${process.env.PUBLIC_URL}/jumpstart-thumb.jpg`,
    title: `The Future of Jumpstarters`,
    creator: `Gryan Duminson`,
    date: `Dec 20, 2024`,
    views: 1200,
    likes: 60,
    comments: 9,
    duration: `13:30`,
    profilePic: `${process.env.PUBLIC_URL}/gryan-pfp.jpg`,
  };

  return <VideoPost {...post} />;
}

export default ExamplePosts;
