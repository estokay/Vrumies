import NavbarWithPost from '../../../Components/NavbarWithPost';
import VehicleHeader from './VehicleHeader';
import '../../../App.css'; // Assuming this is where the shared styles live
import VehiclePostGrid from './VehiclePostGrid';
import { examplePosts } from '../../../Data/VehicleDummyData';
import './VehiclePage.css';
import VehicleRightSidePanel from './VehicleRightSidePanel';


const VehiclePage = () => {
  return (
    <div className="content-page">
      
      <VehicleHeader />
      <div className="main-content">
        <VehiclePostGrid posts={examplePosts} />
        <VehicleRightSidePanel posts={examplePosts} />
      </div>
    </div>
  );
};

export default VehiclePage;