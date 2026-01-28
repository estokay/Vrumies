import BlogCommentsSection from './BlogCommentsSection';
import BlogPostSidePanel from './BlogPostSidePanel';
import './BottomSection.css';

const BottomSection = () => {
  return (
    <div className="bottom-section-container">
      <div className="bottom-section-main-content">
        
        <BlogCommentsSection />
      </div>
      <div className="bottom-section-side-panel">
        <BlogPostSidePanel />
      </div>
    </div>
  );
};

export default BottomSection;
