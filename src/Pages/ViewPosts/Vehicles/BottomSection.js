import VehicleCommentsSection from './VehicleCommentsSection';
import VehiclePostSidePanel from './VehiclePostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        
        <VehicleCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <VehiclePostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
