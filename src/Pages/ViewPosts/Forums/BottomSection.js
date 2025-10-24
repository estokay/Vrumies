import ForumCommentsSection from './ForumCommentsSection';
import ForumPostSidePanel from './ForumPostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        
        <ForumCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <ForumPostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
