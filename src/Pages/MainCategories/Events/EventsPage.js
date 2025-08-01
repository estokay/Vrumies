import React from 'react';
import NavbarWithPost from '../../../Components/NavbarWithPost';
import EventsHeader from './EventsHeader';
import '../../../App.css';

const EventsPage = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <EventsHeader />
    </div>
  );
};

export default EventsPage;
