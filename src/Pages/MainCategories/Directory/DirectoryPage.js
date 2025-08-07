import NavbarWithPost from '../../../Components/NavbarWithPost';
import DirectoryHeader from './DirectoryHeader';
import '../../../App.css';
import DirectoryPostGrid from './DirectoryPostGrid';
import DirectoryRightSidePanel from './DirectoryRightSidePanel';
import { examplePosts } from '../../../Data/DirectoryDummyData';

const DirectoryPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <DirectoryHeader />
      <div className="main-content">
        <DirectoryPostGrid posts={examplePosts} />
        <DirectoryRightSidePanel posts={examplePosts} />
      </div>
    </div>
  );
};

export default DirectoryPage;
