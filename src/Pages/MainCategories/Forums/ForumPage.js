import NavbarWithPost from '../../../Components/NavbarWithPost';
import ForumHeader from './ForumHeader';
import '../../../App.css'; // Assuming this is where the shared styles live
import ForumPostGrid from './ForumPostGrid';
import { examplePosts } from '../../../Data/ForumDummyData';
import './ForumPage.css';
import ForumRightSidePanel from './ForumRightSidePanel';


const ForumPage = () => {
  return (
    <div className="forum-page">
      <NavbarWithPost />
      <ForumHeader />
      <div className="main-content">
        <ForumPostGrid posts={examplePosts} />
        <ForumRightSidePanel posts={examplePosts} />
      </div>
      
    </div>
  );
};

export default ForumPage;