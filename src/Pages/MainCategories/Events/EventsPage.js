import NavbarWithPost from '../../../Components/NavbarWithPost';
import EventsHeader from './EventsHeader';
import '../../../App.css';
import EventsRightSidePanel from './EventsRightSidePanel';
import './EventsPage.css';
import { examplePosts } from '../../../Data/EventsDummyData';
import EventsPostGrid from './EventsPostGrid';

const EventsPage = () => {
  return (
    <div className="events-page">
      <NavbarWithPost />
      <EventsHeader />
      <div className="main-events">
        <EventsPostGrid posts={examplePosts} />
        <EventsRightSidePanel posts={examplePosts} />
      </div>
    </div>
  );
};

export default EventsPage;
