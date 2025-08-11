import NavbarWithPost from '../../Components/NavbarWithPost';
import '../../App.css';
import LeftSidePanel from './LeftSidePanel';
import CenterPanel from './CenterPanel';
import RightSidePanel from './RightSidePanel';
import './InboxPage.css';


const InboxPage = () => {
  return (
    <div className="inbox-page">
      <NavbarWithPost />
      <div className="inbox-layout">
        <LeftSidePanel />
        <CenterPanel />
        <RightSidePanel />
      </div>
    </div>
  );
};

export default InboxPage;
