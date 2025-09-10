import EventCommentsSection from './EventCommentsSection';
import EventPostSidePanel from './EventPostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        
        <EventCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <EventPostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
