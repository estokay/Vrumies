import DirectoryCommentsSection from './DirectoryCommentsSection';
import DirectoryPostSidePanel from './DirectoryPostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        
        <DirectoryCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <DirectoryPostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
