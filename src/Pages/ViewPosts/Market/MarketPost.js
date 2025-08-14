import { useParams } from 'react-router-dom';
import NavbarWithPost from '../../../Components/NavbarWithPost';
import '../../../App.css';
import './MarketPost.css';
import { examplePosts } from '../../../Data/MarketDummyData';
import PostSection from './PostSection';
import VideoCommentsSection from './VideoCommentsSection';
import VideoPostSidePanel from './VideoPostSidePanel';
import MarketHeader from './MarketHeader';

const MarketPost = () => {
  const { id } = useParams();
  const post = examplePosts.find((p) => p.id === Number(id));

  if (!post) {
    return <p style={{ color: 'white', textAlign: 'center' }}>Post not found.</p>;
  }

  return (
    <div className="content-page">
      <NavbarWithPost />
      <MarketHeader />
      <PostSection />
      <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        <VideoCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <VideoPostSidePanel />
      </div>
    </div>
    </div>
  );
};

export default MarketPost;
