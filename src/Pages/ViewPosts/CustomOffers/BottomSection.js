import OfferCommentsSection from './OfferCommentsSection';
import OfferPostSidePanel from './OfferPostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        
        <OfferCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <OfferPostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
