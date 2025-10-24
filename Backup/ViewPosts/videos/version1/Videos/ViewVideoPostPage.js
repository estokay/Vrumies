import React from 'react';
import { useParams } from 'react-router-dom';
import NavbarWithPost from '../../../Components/NavbarWithPost';
import '../../../App.css';
import ViewContentPostHeader from './ViewContentPostHeader';
import VideoPostImageBanner from './VideoPostImageBanner';
import VideoSubHeader from './VideoSubHeader';
import { examplePosts } from '../../../Data/VideoDummyData';
import BottomSection from './BottomSection';
import VideoHeader from './VideoHeader';

const ViewVideoPostPage = () => {
  const { id } = useParams();
  const post = examplePosts.find((p) => p.id === Number(id));

  if (!post) {
    return <p style={{ color: 'white', textAlign: 'center' }}>Post not found.</p>;
  }

  return (
    <div className="video-main-page">
      <VideoHeader />
      <ViewContentPostHeader
        userName={post.creator}
        userImage={post.profilePic}
        location="Houston, TX"
        postTitle={post.title}
        date={post.date}
        categories={['Videos', 'VRUMIES']}
      />
      <VideoPostImageBanner
        imageUrl={post.thumbnail}
        onPlay={() => console.log(`Play video for post ${post.id}`)}
      />
      <VideoSubHeader />
      <BottomSection />
    </div>
  );
};

export default ViewVideoPostPage;
