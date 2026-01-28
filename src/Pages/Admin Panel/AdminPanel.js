import React from 'react';
import NavbarWithPost from '../../Components/NavbarWithPost';
import AdminPanelHeader from './AdminPanelHeader';
import '../../App.css';
import DeleteCollections from './DeleteCollections';
import ViewFirestoreData from './ViewFirestoreData';
import DeletePost from './DeletePost';
import DeleteOrder from './DeleteOrder';
import MakeAnnouncement from '../../Components/Notifications/MakeAnnouncement';

const AdminPanel = () => {
  return (
    <div className="content-page">
      
      <AdminPanelHeader />
      <ViewFirestoreData />
      <MakeAnnouncement />
      <DeleteCollections />
      <DeletePost />
      <DeleteOrder />
    </div>
  );
};

export default AdminPanel;