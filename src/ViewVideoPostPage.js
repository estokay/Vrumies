import React from 'react';
import { useParams } from 'react-router-dom';
import NavbarWithPost from './NavbarWithPost';
import './App.css';
import ViewContentPostHeader from './ViewContentPostHeader';
import VideoPostImageBanner from './VideoPostImageBanner';
import { examplePosts } from './VideoDummyData';
import VideoSubHeader from './VideoSubHeader';

const ViewVideoPostPage = () => {
  const { id } = useParams();

  console.log('useParams() id:', id); // ✅
  console.log('Converted to Number(id):', Number(id)); // ✅
  console.log('All available post IDs:', examplePosts.map(p => p.id)); // ✅
  const post = examplePosts.find((p) => p.id === Number(id)); // ✅
  console.log('Matched post:', post); // ✅

  if (!post) return <p style={{ color: 'white', textAlign: 'center' }}>Post not found.</p>;

  return (
    <div className="content-page">
      <NavbarWithPost />
      <ViewContentPostHeader
        userName={post.creator}
        userImage={post.profilePic}
        location="Somewhere, USA"
        postTitle={post.title}
        date={post.date}
        categories={['Videos', 'VRUMIES']}
      />
      <VideoPostImageBanner
        imageUrl={post.thumbnail}
        onPlay={() => console.log(`Play video for post ${post.id}`)}
      />
      <VideoSubHeader />
    </div>
  );
};

export default ViewVideoPostPage;
