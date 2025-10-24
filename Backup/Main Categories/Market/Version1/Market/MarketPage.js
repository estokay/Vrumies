import NavbarWithPost from '../../../Components/NavbarWithPost';
import MarketHeader from './MarketHeader';
import '../../../App.css';
import MarketPostGrid from './MarketPostGrid';
import MarketRightSidePanel from './MarketRightSidePanel';
import { examplePosts } from '../../../Data/MarketDummyData';

const MarketPage = () => {
  return (
    <div className="content-page">
      
      <MarketHeader />
      <div className="main-content">
        <MarketPostGrid posts={examplePosts} />
        <MarketRightSidePanel posts={examplePosts} />
      </div>
    </div>
  );
};

export default MarketPage;
