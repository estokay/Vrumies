import React from 'react';
import VideoPostLayout from './VideoPostLayout';
import { examplePosts } from './VideoDummyData'; // importing array of posts

function ExampleVideoPost() {
  const post = examplePosts[0]; // grab the first post

  if (!post) {
    return <p>No post data available.</p>;
  }

  return <VideoPostLayout {...post} />;
}

export default ExampleVideoPost;
