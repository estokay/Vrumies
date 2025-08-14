import VideoCommentsSection from './VideoCommentsSection';
import VideoPostSidePanel from './VideoPostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        
        <VideoCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <VideoPostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
